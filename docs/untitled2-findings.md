# Untitled-2 homepage inspection findings

The supplied source is a Figma-style fixed desktop export with a 1440px canvas and approximately 6321px height. Its visible composition is a light #fbfbfb page with a small circular CAU mark and centered bordered navigation, a single-line uppercase hero heading reading “WELCOME TO CAU, WHERE YOUR FUTURE IS BRIGHT.”, a compact two-field program finder, a large group photograph, and a coral caption bar with white positioning copy. The next major section is an asymmetric “WHY CYPRUS AYDIN UNIVERSITY?” split layout, followed by numbers, degree cards, testimonials, news, partner marks, contact, community, and footer content.

The source uses Inter/NB International, black ink, coral-red accents, thin gray rules, and a responsive adaptation is required because its original markup is fixed-position desktop output. Existing project HTML already contains the same major content sections and functional hooks, so the preferred implementation is to adapt the current semantic Bootstrap markup and use the supplied source’s imagery and visual hierarchy rather than copying the fixed export wholesale.

Extracted source imagery in /home/ubuntu/webdev-static-assets/untitled2:

| Asset | Visual role |
|---|---|
| untitled2-1-ecf559a222.jpg | Two students outside campus |
| untitled2-10-446dae8c4c.jpg | International student portrait |
| untitled2-11-88f245d7e3.jpg | Student in campus setting |
| untitled2-12-b26e7632db.jpg | Campus gate |
| untitled2-13-24f9b4bd8b.jpg | Interview/event image |
| untitled2-14-def7ddf464.jpg | Students holding CAU banner |
| untitled2-15-857094fecf.jpg | Campus walkway |
| untitled2-17-36e131442f.jpg | Main group photograph used in supplied hero |
| untitled2-9-ee2a180aac.png | Large student portrait |
| untitled2-2, -3, -4, -5, -6, -7, -8, -16 | Partner/accreditation and CAU logo marks |

## Verification pass

The adapted desktop homepage now uses the supplied group photograph and coral caption bar successfully. The main remaining issue is that the single-line desktop welcome heading is slightly wider than the available content rail at 1440px and is clipped on the right. The mobile layout wraps the heading cleanly, keeps the program finder usable, and preserves the source image/caption composition; the hero caption becomes a readable stacked block with centered arrow controls. The next correction is to reduce only the desktop maximum heading scale so the supplied one-line title fits without weakening the mobile hierarchy.

## Final hero verification

At 1440px the complete welcome headline now fits within the content rail, and the supplied group photograph plus coral caption bar align with the reference composition. The mobile-specific heading override remains in place, so the headline continues to wrap rather than overflow on narrow screens.

## Regression correction verification

The homepage now uses the original Space Grotesk family again. The news section visibly restores the broader Untitled-2 category set, and the filter script supports multi-tag cards plus live story-count feedback. The lower page now follows the supplied footer hierarchy: community row first, then Useful Link and Newsletters as two editorial rails, with the source copy “Your Email Adress,” the source newsletter paragraph, and the 2025 copyright line. Desktop full-page and mobile full-page screenshots both render without layout overflow.

## Selected footer reference

The rendered Untitled-2 footer confirms the intended structure: a navy contact panel above a community row with five bordered social buttons (Facebook, X, Youtube, LinkedIn, Instagram); beneath it, a three-column footer grid with Useful Link, More.., and Newsletters; vertical rules between the three columns; the newsletter input aligned on the heading row with “Your Email Adress”; the source newsletter paragraph below; and the 2025 copyright baseline across the bottom. The current implementation is missing the More.. column and must be restored.

## Selected footer verification

The desktop footer now visibly matches the selected reference structure: the navy contact panel is followed by five social buttons, then Useful Link, More.., and Newsletters columns with vertical rules and a bottom copyright baseline. The mobile view stacks these columns cleanly while preserving all five community controls and the newsletter form. The newsletter and contact form IDs remain unchanged for existing JavaScript behavior.

## Homepage program-finder section verification

Added the supplied programme finder between CAU in numbers and Discover our degrees. Desktop rendering shows the large Find your program heading, supporting copy, segmented level/interest controls, coral Show programs action, and six bordered cards in a three-column grid. Mobile rendering stacks the controls and cards into a readable single-column layout while preserving the existing footer and navigation.

## Tuition & Fees page verification

Added `/tuition.html` with the reference-matched title, hero treatment, tuition overview, undergraduate and graduate fee tables, payment requirements, Garanti Bankası details, contact panel, community row, and selected three-column footer. Desktop rendering preserves the wide table hierarchy and footer proportions; mobile rendering keeps the tables horizontally scrollable and stacks payment, contact, community, and footer sections without overflow.

## News & Events archive verification

Replaced the previous article-only `/news.html` view with a complete archive. The desktop view includes an oversized title, search rail, eight category filters, featured story treatment, six current story cards, and the shared contact/footer structure. The mobile view stacks the stories cleanly, wraps the filters, preserves readable metadata and links, and keeps the shared footer responsive.

## Finder Swiss Editorial restyling verification

Recomposed the homepage finder into the existing split-rail layout. The section now uses the same asymmetric left rail as Why CAU, Discover our degrees, testimonials, and News and events; thin rules and square card edges replace the independent rounded-card system; typography follows Space Grotesk and existing section scale; controls use the existing coral/navy/line tokens; and programme links use the supplied arrow asset treatment. Desktop and mobile screenshots preserve the functional controls and section rhythm.

## Finder substantial improvement verification

The finder now has a clearer editorial anchor with a section index, stronger split-rail hierarchy, a full-width control band, larger title treatment, intentional alternating neutrals and coral card accents, and underlined arrow-led actions. The mobile composition keeps the rail narrative, stacks the controls, and preserves clear card rhythm instead of collapsing into a generic card stack.

## Finder degree-system parity verification

The finder now directly shares the Discover our degrees system: the same left rail proportions, two-column card grid, 355px desktop card geometry, 310px tablet geometry, compact mobile cards, 50/44px desktop card padding, square borders, coral highlight cards, and Bootstrap coral/light CTA variants. Desktop and mobile screenshots show the two sections reading as one coherent component family.
