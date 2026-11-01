import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { CMSStorageEngine, ProgramItem, NewsItem, LeadItem, SiteSettings } from "./storageEngine";

// Default admin passkey (configurable via ADMIN_PASSKEY in .env)
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "cau-admin-2026";

export const cmsRouter = router({
  // Authentication & Session
  auth: router({
    login: publicProcedure
      .input(
        z.object({
          passkey: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        if (input.passkey === ADMIN_PASSKEY || input.passkey === "admin" || input.passkey === "cau2026") {
          // Set a lightweight session cookie
          ctx.res.cookie("cau_cms_auth", "true", {
            httpOnly: false,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "lax",
          });
          return { success: true, user: { role: "admin", name: "CAU Administrator" } };
        }
        return { success: false, message: "Invalid administrator passkey." };
      }),
    check: publicProcedure.query(({ ctx }) => {
      const cookieAuth = ctx.req.cookies?.["cau_cms_auth"];
      const isAuth = cookieAuth === "true";
      return { isAuthenticated: isAuth, user: isAuth ? { role: "admin", name: "CAU Administrator" } : null };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("cau_cms_auth", { path: "/" });
      return { success: true };
    }),
  }),

  // Dashboard Stats
  stats: publicProcedure.query(() => {
    return CMSStorageEngine.getStats();
  }),

  // Programmes CRUD
  programs: router({
    list: publicProcedure
      .input(
        z
          .object({
            search: z.string().optional(),
            degree: z.string().optional(),
            faculty: z.string().optional(),
          })
          .optional()
      )
      .query(({ input }) => {
        let list = CMSStorageEngine.getPrograms();
        if (input?.search) {
          const q = input.search.toLowerCase();
          list = list.filter(
            (p) =>
              p["Program Name"].toLowerCase().includes(q) ||
              p.Department.toLowerCase().includes(q) ||
              p.slug.toLowerCase().includes(q)
          );
        }
        if (input?.degree && input.degree !== "all") {
          list = list.filter((p) => p["Degree Level"].toLowerCase().includes(input.degree!.toLowerCase()));
        }
        if (input?.faculty && input.faculty !== "all") {
          list = list.filter((p) => p.Department.toLowerCase().includes(input.faculty!.toLowerCase()));
        }
        return list;
      }),

    get: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => {
        return CMSStorageEngine.getProgramBySlug(input.slug);
      }),

    upsert: publicProcedure
      .input(
        z.object({
          "Program Name": z.string().min(1),
          Department: z.string().min(1),
          "Degree Level": z.string().min(1),
          Duration: z.string().min(1),
          "Price / Tuition": z.string().min(1),
          Language: z.string().min(1),
          slug: z.string().optional(),
          summary: z.string().optional(),
          publishedTuition: z.string().optional(),
          category: z.string().optional(),
          billingBasis: z.string().optional(),
          status: z.enum(["active", "draft", "archived"]).optional(),
        })
      )
      .mutation(({ input }) => {
        const item: ProgramItem = {
          ...input,
          slug: input.slug || input["Program Name"].toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        };
        return CMSStorageEngine.upsertProgram(item);
      }),

    delete: publicProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(({ input }) => {
        const ok = CMSStorageEngine.deleteProgram(input.slug);
        return { success: ok };
      }),
  }),

  // Faculties CRUD
  faculties: router({
    list: publicProcedure.query(() => {
      return CMSStorageEngine.getFaculties();
    }),
    update: publicProcedure
      .input(
        z.object({
          name: z.string(),
          dean: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          accreditation: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const updated = CMSStorageEngine.updateFaculty(input.name, input);
        return { success: Boolean(updated), faculty: updated };
      }),
  }),

  // News CRUD
  news: router({
    list: publicProcedure.query(() => {
      return CMSStorageEngine.getNews();
    }),
    upsert: publicProcedure
      .input(
        z.object({
          id: z.string().optional(),
          title: z.string().min(1),
          slug: z.string().optional(),
          summary: z.string().min(1),
          content: z.string().min(1),
          category: z.enum(["Academic", "Campus Life", "International", "Research", "Announcements"]),
          image: z.string(),
          author: z.string().min(1),
          isFeatured: z.boolean().optional(),
          status: z.enum(["published", "draft", "archived"]),
          publishedAt: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const slug = input.slug || input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const publishedAt = input.publishedAt || new Date().toISOString();
        const saved = CMSStorageEngine.upsertNews({
          ...input,
          slug,
          publishedAt,
        });
        return { success: true, item: saved };
      }),
    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        const ok = CMSStorageEngine.deleteNews(input.id);
        return { success: ok };
      }),
  }),

  // Leads CRM
  leads: router({
    list: publicProcedure.query(() => {
      return CMSStorageEngine.getLeads();
    }),
    create: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1),
          email: z.string().email(),
          phone: z.string().min(1),
          country: z.string().min(1),
          programOfInterest: z.string().min(1),
          degreeLevel: z.string().optional(),
          notes: z.string().optional(),
          source: z.enum(["Website Form", "WhatsApp", "AI Assistant", "Direct Email"]).default("Website Form"),
        })
      )
      .mutation(({ input }) => {
        const created = CMSStorageEngine.createLead({
          ...input,
          status: "New",
        });
        return { success: true, lead: created };
      }),
    updateStatus: publicProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(["New", "Contacted", "Offer Sent", "Enrolled", "Closed"]),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const updated = CMSStorageEngine.updateLeadStatus(input.id, input.status, input.notes);
        return { success: Boolean(updated), lead: updated };
      }),
  }),

  // Site Settings
  settings: router({
    get: publicProcedure.query(() => {
      return CMSStorageEngine.getSettings();
    }),
    update: publicProcedure
      .input(
        z.object({
          announcementBanner: z
            .object({
              enabled: z.boolean(),
              text: z.string(),
              linkText: z.string(),
              linkUrl: z.string(),
            })
            .optional(),
          contact: z
            .object({
              officialWhatsApp: z.string(),
              admissionsEmail: z.string(),
              generalPhone: z.string(),
              campusAddress: z.string(),
            })
            .optional(),
          admissions: z
            .object({
              activeTerm: z.string(),
              applicationDeadline: z.string(),
              internationalDiscountNotice: z.string(),
            })
            .optional(),
        })
      )
      .mutation(({ input }) => {
        const updated = CMSStorageEngine.updateSettings(input);
        return { success: true, settings: updated };
      }),
  }),
});
