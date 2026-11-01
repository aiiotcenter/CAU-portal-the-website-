Senior Project -1

COM491

Developing Cyprus Aydin University Website

Saif Radman

B2205.040012

Advisor: Dr. Öğr. Üye. Ruhsan Önder

TABLE OF CONTENTS

i. DECLARATION OF AUTHORSHIP

i. APPROVAL PAGE

iii. ACKNOWLEDGMENTS

iv. ABSTRACT

1. Introduction1

2. Literature Search and Design Methodology1

2.1 Design System Theory1

2.2 Visual Identity and Color Strategy1

2.3 Typographic Hierarchy1

2.4 Shape, Shadow, and Iconography2

2.5 User Interface Components and Interactive Elements2

3. System Architecture7

3.1 Information Architecture (Sitemap)7

3.2 User Interface Component Library7

4. User Experience Analysis9

4.1 User Experience Strategy & User Journey9

4.2 Key User Experience Features and Logic9

4.3 Information Architecture9

5. Website Wireframe and Interface Architecture10

5.1 Global Framework10

5.2 Core Page Layouts10

5.3 Visual Hierarchy and Design Elements10

6. User Interface Design15

6.1 Design Methodology and Software Stack15

6.2 Interface Logic and User Experience15

7. Project Management (Jira Integration)22

8. Use Case Analysis23

9. Implementaion and Coding24

10. Conclution25

11. References26

i. DECLARATION OF AUTHORSHIP

I, Saif Radman, student number B2205.040012, hereby certify that this senior project, "Developing the international version of Cyprus Aydın University Website.": A Comprehensive Digital Identity, User Interface, and User Experience," is entirely my own.

I certify that:

• All of this work was completed while pursuing a degree at Cyprus Aydın University.

• It has been made clear if any portion of this project has previously been submitted for a degree or other qualification at this university or any other institution.

• I always provide due credit when I consult someone else's published work.

• I always cite my sources when I quote someone else's work.

Date: January 14, 2026

ii. APPROVAL PAGE

Student Name: Saif Radman Student ID: B2205.040012 Project Title: Senior Project - 1: CAU international Website (Developing the international version of Cyprus Aydın University Website.)

This project has been examined and is approved in partial fulfillment of the requirements for the degree in Software Engineering.

Dean of Department: Prof.Dr. Hikmet Ş. Aybar

1- Assist. Prof Dr. Ruhsan Önder

2- Assist. Prof. Dr. Zeluwa Everistus Orji

3- Assist. Prof Dr. Gizem Baran

Date: ___________________________

iii. ACKNOWLEDGMENTS

I truly appreciate Dr. Öğr. Üye. Ruhsan Önder, my project advisor, for her constant backing, patience, and guidance over the course of this project.

I also want to express my gratitude to the Cyprus Aydın University faculty for providing the academic background required to finish this work.

Lastly, I would like to express my gratitude to the designers and developers of the tools used in this project, particularly Figma, Jira, and Adobe Creative Cloud, all of which were crucial in creating this digital identity.

iv. ABSTRACT

The creation of a comprehensive digital identity for CAU Website (Developing the international version of Cyprus Aydın University Website) is described in this study. The project's main goal is to develop a user-friendly website that is accessible to a wide range of international users while keeping a professional academic edge.

The project strengthens a consistent brand identity across all digital touchpoints by integrating a structured Design System with cutting-edge prototyping tools like Figma. A specialized program search tool for academic programs, a hierarchical information architecture, and a "Frictionless Discovery" model that guides potential students from curiosity to application are some of the key features. In order to create authority, clarity, and trust within the academic community, the final interface employs a particular visual strategy, such as a color scheme of orange and navy blue.

1. Introduction

The website for Cyprus Aydın University is explained in this document. The effectiveness of the university's digital identity is just as important as the design of the website. Making a website that is simple to use and available to a diverse user base is the aim. The main aim is to represent the values of Cyprus Aydın University, including global recognition, leadership, and accessibility. These principles are transformed into an easily understood design approach especially those who are interested in studying at Cyprus Aydın University but are from other countries.

2. Literature Search and Design Methodology

2.1 Design System Theory

The main guide for all digital platforms is the Design System. It makes the design and development process easier and helps maintain brand consistency. Easy reading and academic professionalism are guaranteed by the system's clear visual guidelines and design elements. The visual components were carefully chosen. They work well in an academic setting as well to being pleasing to the eye. These decisions help with the development of authority, clarity, and trust.As illustrated in Figure 1a–1b-1c-1d-1e-1f, the design system defines standardized visual elements such as User interface elements, radius, shadow, typography, colors and icons interface components. Design systems are widely used to ensure visual consistency and scalability in interface design (Figma, 2025).

2.2 Visual Identity and Color Strategy

The color palette was intentionally selected to establish authority and trust.

Primary Brand Colors: Navy Blue (#002469) and Orange (#F44029).

Neutral Palette: A range of grayscale tones is used for balance, including White (#FFFFFF), Light Grays (#D9D9D9, #B5B5B5), Dark Gray (#686868), and Black (#000000). Color consistency plays a key role in strengthening brand identity and improving usability (Adobe, 2025).

2.3 Typographic Hierarchy

The project utilizes a single, modern typeface NB INTERNATIONAL to maintain a clean academic style across all devices.

Desktop Scale: Heading 1 ($77.23px$), Heading 2 ($47.73px$), Heading 3 ($29.5px$).

Mobile Scale: Heading 1 ($40px$), Heading 2 ($24.72px$), Heading 3 ($15.45px$)

2.4 Shape, Shadow, and Iconography

To maintain a modern, "Flat User Interface" aesthetic, the design avoids drop shadows.

Shapes: All components use a consistent corner radius of $10px$.

Iconography: A minimalist library of line and solid icons is implemented for core navigation Home, User, Settings.

2.5 User Interface Components and Interactive Elements

The interface relies on standardized components to ensure a predictable user experience:

Action Buttons: Primary buttons utilize high-contrast Brand Orange with white text and directional arrows "Send" or "Apply".

Form Fields: Standardized inputs for Name, Phone, and Email include large text areas for user messaging.

Navigation & Selection: Dropdown menus are used for data filtering, allowing users to select specific degrees or departments efficiently.

Figure 1a. User Interface Elements used in the CAU design system.

Figure 1b. Radius used in the CAU design system.

Figure 1c. Shadow used in the CAU design system.

Figure 1d. Typography used in the CAU design system.

Figure 1e. Color palette used in the CAU design system.

Figure 1f. icons used in the CAU design system.

3. System Architecture

3.1 Information Architecture (Sitemap)

The CAU website uses a hierarchical tree structure to ensure intuitive navigation, centered around a main Home page hub with consistent global elements.

Global Header: Features the university logo, navigation menu (About us, Programs, Scholarships, Tuitions), language toggle, and "Apply Now!" button.

Home Page Hub: Features a program search tool, university mission, and student testimonials.

Specialized Areas: Includes Informational (About Us), Admission and Programs (134 academic programs), and Scholarships/Tuition guides.

Safety Nets: Includes a 404 Error page to help users navigate back if they encounter a broken link.

As shown in Figure 2, the website follows a hierarchical sitemap that supports clear navigation across all sections.

3.2 User Interface Component Library

The User Interface library ensures that every interactive element across the site remains consistent with the Design System.

Buttons and Inputs: Primary action buttons use the brand Orange with white text and directional arrows.

Form Fields: Standardized text inputs for Name, Phone, and Email, including large text areas for messaging.

Navigation and Selection: Uses specialized Select Menus and Dropdowns for filtering data, such as selecting a specific degree or department.

Iconography: A library of minimalist line and solid icons used for core navigation (home, user, settings).

Figure 2. hierarchical sitemap used in information architecture (Sitemap) .

4. User Experience Analysis

4.1 User Experience Strategy & User Journey

The Frictionless Discovery model forms the foundation for the interface's design. Moving a potential student from "curiosity" to "application" with the least amount of cognitive strain is the main objective. A clear information hierarchy and ongoing support are the means by which this is achieved. User centered design principles focus on reducing cognitive load and improving task efficiency (Relume, 2025).

4.2 Key User Experience Features and Logic

Guided Navigation (Program Filter):

User Experience Logic: Instead of browsing a long list of more than 40 programs, the Fast Search uses a two-step funnel Degree, right arrow Program.

Benefit: Benefit of Reduced Choice Overload is about helping users find relevant academic paths in seconds.

Lead Retention (Newsletter & Support Form):

User Experience Logic: The "Can't find what you are looking for?" section appears at the bottom of long pages.

Benefit: It acts as a safety net for users who have finished scrolling but haven't found a specific answer, preventing them from leaving the site.

Trust and Credibility of the International Office and Testimonials:

User Experience Logic: Direct human connection is prioritized. Regional managers are listed with photos and direct emails, and student testimonials use real world social proof.

Benefit: Reduces anxiety for international students by showing a face behind the institution.

4.3 Information Architecture

The site uses the Standard of Global Header and Footer to maintain a sense of place.

Accordions and Tables: Large datasets like the Rectorate Directory or FAQs are hidden behind expandable accordions to maintain a clean visual aesthetic while remaining high density in information.

Visual Cues: High contrast Apply Now buttons are consistently placed in the top-right for maximum visibility.

5. Website Wireframe and Interface Architecture

The strategic sitemap is turned into a useful, user centered layout by the wireframes. To guarantee accessibility, the design places a strong emphasis on a responsive structure and a clear content hierarchy. As shown in Figure 3a–3b-3c-3d, the wireframes translate the information architecture into structured layouts across key website pages.

5.1 Global Framework

To ensure a smooth user experience, a common framework is used for all wireframes.

Persistent Header: The CAU logo, a main menu about us, programs, scholarships, tuition, and fees, and the prominent "Apply Now!" action button are all present on every page.

Standardized Footer: At the bottom of every page are social media links (including Facebook, Twitter, YouTube, LinkedIn, and Instagram), a newsletter subscription form, and a help contact form.

Responsive Scaling: in layouts intended for multi-device compatibility, typography and spacing are automatically modified for mobile readability.

5.2 Core Page Layouts

The wireframes are organized into distinct templates based on the user's intent:

The Home Page: features a high-impact "Hero" section with a program search tool dropdown for degree and program and a statistics section highlighting 4,000+ students and 30+ nationalities.

Admission and Process Pages: were designed with clear, scan able checklists for required documents like passports, diplomas, transcripts, and tables for intake cycles.

Program Search: used a functional sidebar with filters for Degree, Department, Language, and Duration to help users navigate the database of all programs that are available.

5.3 Visual Hierarchy and Design Elements

Visual Hierarchy: While smaller Heading 2 and 3 styles define subsections to guide the user's eye, larger Heading 1 styles, which are 77 pixels for desktop, are used for primary titles.

Design Elements: Depending on the column width of the element, the system's corner radii are Large, Medium, and Small, and it follows to a solid design principle with no shadows.

Navigation Aids: In the event that a broken link is found, users are taken back to the home page by safety nets like the 404 Error page.

Figure 3-a. Home, Contact us, programs, about CAU pages wireframe.

Figure 3-b. Error, News and Event, International office pages’ wireframe.

Figure 3-c. FAQ, Program Details, Admission, scholarship pages’ wireframe.

Figure 3-e. Tuition and fees, pages wireframe.

6. User Interface Design

6.1 Design Methodology and Software Stack

The user interface was developed through a professional design to production workflow, ensuring the branding of the university is consistent across all digital touchpoints.

As shown in Figure 4-a, 4-b, 4-c, 4-d, 4-e, the user interface adapts responsively across desktop, and mobile screen sizes while maintaining visual consistency and usability.

Figma was the basic design tool for prototyping to make the architecture layout and build the responsive library.

Adobe Photoshop takes care of the professional photo editing and color grading of campus images to align with the visual system of the design.

The design system strictly adheres to the university identity by using a specific color hierarchy:

Primary Navy Blue is Used for headers, footers, and primary headings to establish a foundation.

Black color is applied as a secondary accent color for borders and design headings and text that markers to reflect traditional academic prestige.

Call-to-Action orange is a high contrast yellow/amber used exclusively for buttons such as Apply Now! and Search. he aims of this color is to direct the user's attention to the most crucial conversion points. Neutral Whites & Grays: Used for secondary text and background surfaces to guarantee optimal readability and a tidy, contemporary look.

Responsive design ensures accessibility across different devices and screen sizes (Figma, 2025).

6.2 Interface Logic and User Experience

Program Search Filter was Designed to manage more than 40+ academic programs efficiently, reducing search friction for prospective students, the program search feature was designed based on common academic website patterns, with inspiration taken from the Cyprus International University academic programs interface (Cyprus International University, 2025).

Consistency through Design Systems: By creating a design system in Figma, every element buttons, form fields, and cards is a reusable component. This ensures that the user experience is identical across the Home, Admissions, and International Office pages.

Visual Hierarchy: Large, bold typography and consistent whitespace were used to organize content, making complex information like admission requirements easy to digest.

Figure 4-a. User interface design resolutions. Homepage and Contact Us page.

Figure 4-b. User interface design resolutions. New and Events, and Contact Us page.

Figure 4-c. User interface design resolutions. New and Events, and Contact Us page.

Figure 4-d. User interface design resolutions. Scholarship and FAQ page.

Figure 4-e. User interface design resolutions. Programs search and about us page.

7. Project Management (Jira Integration)

Jira was utilized as the primary management platform to ensure organized development and task tracking. This approach allowed for the breakdown of the website’s complex requirements into manageable units as shown in Figure 5.

Project Organization in Jira

Epics for High Level Planning

I divided the project into major modules called Epics. These include the Global Site Architecture, Admissions System, Academic Database, and Financial Services. This allows for a clear view of the overall progress of each major section of the university website.

User Stories and Requirements

Inside each Epic, specific User Stories were created to define what a visitor needs. For example, a story might focus on a student’s ability to search for a program or calculate tuition fees. Each story contains a list of specific requirements to ensure all necessary data from the project documentation is included.

Agile project management tools support task tracking and workflow organization (Atlassian, 2025).

Task Tracking and Management

Each requirement was converted into individual tasks. These tasks were managed through a digital board to track their status:

Figure 5. Breakdown the tasks manageable units in Jira tool.

8. Use Case Analysis

Use Case 1: Search Academic Program

• Actor: Future Learner

• Description: To find available academic programs, the user chooses a department and degree level.• System Response: After processing the request, the system shows a filtered list of programs that match.• Result: The user effectively finds appropriate academic programs.

Use Case 2: View Program Details

• Actor: Foreign student• Description: To view comprehensive details, the user chooses a program from the list.• System Response: The program description, length, and prerequisites for admission are displayed by the system.• Result: The user fully comprehends the chosen program.

Use Case 3: Submit Contact Form

• Actor: Future Learner• Description: The contact form is used by the user to submit an inquiry.

• System Reaction: The message is sent to the university email after the system verifies the input.• Result: The inquiry was delivered successfully.

Use Case 4: Browse Admissions Information

• Actor: Candidate• Description: The user reviews the application requirements by navigating to the admissions section.• System Response: The necessary paperwork and application procedures are shown by the system.• Result: The user has a clear understanding of the application process.

9. Implementation and Coding

HTML and CSS implementation of the suggested website design is shown in this section. The implementation shows how the wireframes and user interface design were transformed into structure front-end code. This implementation focuses on the program search interface and hero section, which act as the website's main channels for user interaction.

The page's semantic structure, which includes the program selection elements, hero content, and navigation header, is defined by the HTML code. Layout styling, spacing, responsiveness, and visual coherence with the university's branding standards are all handled by the CSS code.

The implementation follows standard front-end web development practices using HTML and CSS (MDN Web Docs, 2025).

Figures 6-a and 6-b illustrate how the user interface design is implemented using structured HTML and styled using CSS to produce a visually appealing and responsive.

Figure 6-a. HTML Codes.Figure 6b. CSS Codes

10. Conclusion

The Cyprus Aydın University website project effectively converts the institution's principles into a useful online platform. The website offers both domestic and foreign students a polished and user-friendly experience by following a careful design system and an organized information architecture.

11. References

- Adobe Creative Cloud. (2025). Photoshop: Photo editing and color grading standards. https://www.adobe.com/products/photoshop.html

- Atlassian. (2025). Jira software: Agile project management. https://www.atlassian.com/software/jira

- Cyprus Aydın University. (2025). International website. https://international.cau.edu.tr/

- Figma. (2025). Design systems and UI components. https://www.figma.com/

- Relume. (2025). User experience design patterns and website structures. https://www.relume.io/

- Cyprus International University. (2025). Academic programs. https://ciu.edu.tr/en/programs

- MDN Web Docs. (2025). HTML: HyperText Markup Language. https://developer.mozilla.org/en-US/docs/Web/HTML

- MDN Web Docs. (2025). CSS: Cascading Style Sheets. https://developer.mozilla.org/en-US/docs/Web/CSS
