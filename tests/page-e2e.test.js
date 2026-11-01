import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

const BASE_URL = 'http://localhost:3000/english-quest.html';
const html = fs.readFileSync('client/english-quest.html', 'utf8');
const jsCode = fs.readFileSync('client/scripts/english-quest.js', 'utf8');

describe('CAU English Preparatory School Arena Hub - Comprehensive Test Suite', () => {

  describe('1. HTTP Server & Document Structure', async () => {
    test('Server serves english-quest.html with HTTP 200 OK', async () => {
      const res = await fetch(BASE_URL);
      assert.strictEqual(res.status, 200, 'Expected HTTP status 200');
      const text = await res.text();
      assert.ok(text.length > 50000, 'HTML content length should be substantial');
    });

    test('Includes proper DOCTYPE, language, and SEO meta tags', () => {
      assert.ok(html.includes('<!doctype html>'), 'Must have DOCTYPE');
      assert.ok(html.includes('<html lang="en">'), 'Must have lang="en"');
      assert.ok(html.includes('<meta charset="UTF-8" />'), 'Must have UTF-8 charset');
      assert.ok(html.includes('name="viewport"'), 'Must have viewport meta');
      assert.ok(html.includes('name="description"'), 'Must have meta description');
      assert.ok(html.includes('<title>CAU English Preparatory School Arena Hub | Cyprus Aydın University</title>'), 'Must have exact title');
    });

    test('Loads Swiss Editorial design fonts and stylesheets', () => {
      assert.ok(html.includes('/assets/vendor/fonts/nb-international.css'), 'NB International font');
      assert.ok(html.includes('/assets/vendor/fonts/inter.css'), 'Inter font');
      assert.ok(html.includes('/assets/vendor/fonts/space-grotesk.css'), 'Space Grotesk font');
      assert.ok(html.includes('/styles/main.css'), 'Main CSS');
      assert.ok(html.includes('/styles/english-quest.css'), 'English Quest CSS');
      assert.ok(html.includes('/styles/footer.css'), 'Footer CSS');
      assert.ok(html.includes('/manifest.webmanifest'), 'PWA Webmanifest');
    });

    test('Canonical Header and Footer placeholders are mounted', () => {
      assert.ok(html.includes('id="cauHeader"'), 'Header #cauHeader mounted');
      assert.ok(html.includes('id="cauHeaderSearchForm"'), 'Central search form mounted');
      assert.ok(html.includes('id="cauSearchDrawer"'), 'Search suggestion drawer mounted');
      assert.ok(html.includes('<footer data-shared-footer="true">'), 'Shared footer placeholder mounted');
      assert.ok(html.includes('/scripts/shared-footer.js'), 'Shared footer script tag');
      assert.ok(html.includes('/scripts/english-quest.js'), 'English Quest script tag');
    });
  });

  describe('2. Product Architecture - 15 Required DOM Elements', () => {
    const REQUIRED_15 = [
      'nextActionCard',
      'nextActionCtaBtn',
      'onboardingModal',
      'onboardingTriggerBtn',
      'questionSelectionReason',
      'facultyDeskModal',
      'tab-contenthealth-btn',
      'facultyTabPane-contenthealth',
      'tab-mondaysheet-btn',
      'facultyTabPane-mondaysheet',
      'deleteDataModal',
      'deleteDataBtn',
      'facultyDeskBtn',
      'downloadReportBtn',
      'mistakesQueueBadge'
    ];

    for (const id of REQUIRED_15) {
      test(`Required architecture ID "${id}" is present in HTML`, () => {
        const pattern = new RegExp(`id=["']${id}["']`);
        assert.ok(pattern.test(html), `Target ID "${id}" must exist in HTML`);
      });
    }
  });

  describe('3. JavaScript Integration - All 133 Unique Element IDs', () => {
    const re = /getElementById\(['"]([^'"]+)['"]\)/g;
    const ids = new Set();
    let m;
    while ((m = re.exec(jsCode)) !== null) {
      ids.add(m[1]);
    }

    test(`All ${ids.size} unique IDs queried by english-quest.js exist in HTML`, () => {
      const missing = [];
      for (const id of ids) {
        const pattern = new RegExp(`id=["']${id}["']`);
        if (!pattern.test(html)) {
          missing.push(id);
        }
      }
      assert.deepStrictEqual(missing, [], `Missing IDs in HTML: ${missing.join(', ')}`);
    });
  });

  describe('4. The 4-View Segmented Architecture', () => {
    test('4-View segmented navigation buttons exist with proper data-pillar attributes', () => {
      assert.ok(html.includes('data-pillar="pillar-focus"'), 'Today Focus button');
      assert.ok(html.includes('data-pillar="pillar-curriculum"'), 'Curriculum button');
      assert.ok(html.includes('data-pillar="pillar-analytics"'), 'Analytics button');
      assert.ok(html.includes('data-pillar="pillar-community"'), 'Community button');
    });

    test('All 4 view panes exist in HTML with proper active state', () => {
      assert.ok(html.includes('id="pillar-focus" class="pillar-pane is-active"'), 'View 1 starts active');
      assert.ok(html.includes('id="pillar-curriculum" class="pillar-pane"'), 'View 2 exists');
      assert.ok(html.includes('id="pillar-analytics" class="pillar-pane"'), 'View 3 exists');
      assert.ok(html.includes('id="pillar-community" class="pillar-pane"'), 'View 4 exists');
    });

    test('switchPillar supports all 4 views plus legacy 3-pillar aliases', () => {
      assert.ok(jsCode.includes('PILLAR_ALIASES'), 'Must define PILLAR_ALIASES mapping');
      assert.ok(jsCode.includes("'pillar-arena': 'pillar-focus'"), 'Alias for pillar-arena');
      assert.ok(jsCode.includes("'pillar-simulator': 'pillar-analytics'"), 'Alias for pillar-simulator');
      assert.ok(jsCode.includes("'pillar-speaking': 'pillar-community'"), 'Alias for pillar-speaking');
      assert.ok(jsCode.includes('window.switchMainView = switchPillar'), 'Export switchMainView');
    });
  });

  describe('5. View 1: Today\'s Focus Components', () => {
    test('Hero Next Best Action Card has all sub-elements', () => {
      assert.ok(html.includes('id="nextActionCard"'), 'Card container');
      assert.ok(html.includes('id="nextActionTime"'), 'Estimated time');
      assert.ok(html.includes('id="nextActionTitle"'), 'Title');
      assert.ok(html.includes('id="nextActionDesc"'), 'Description');
      assert.ok(html.includes('id="nextActionEvidence"'), 'Evidence basis');
      assert.ok(html.includes('id="nextActionCtaBtn"'), 'Primary CTA button');
      assert.ok(html.includes('id="nextActionCtaText"'), 'CTA text');
      assert.ok(html.includes('id="mistakesQueueBadge"'), 'Mistakes review badge');
    });

    test('4 Quick Prep Module launch cards are present', () => {
      assert.ok(html.includes("startLesson(0)"), 'Module 1 A2 quick launcher');
      assert.ok(html.includes("startLesson(1)"), 'Module 2 B1 quick launcher');
      assert.ok(html.includes("startLesson(2)"), 'Module 3 B2 quick launcher');
      assert.ok(html.includes("startLesson(4)"), 'Module 4 C1 quick launcher');
    });

    test('Weekend Teacher Flash Sprint Card has all sub-elements', () => {
      assert.ok(html.includes('id="weekendChallengeCard"'), 'Weekend challenge card');
      assert.ok(html.includes('id="activeChallengeTeacher"'), 'Teacher name');
      assert.ok(html.includes('id="activeChallengeTitle"'), 'Challenge title');
      assert.ok(html.includes('id="activeChallengeNote"'), 'Teacher quote');
      assert.ok(html.includes('id="enrolledCountBadge"'), 'Enrolled count');
      assert.ok(html.includes('startWeekendFacultyChallenge'), 'Enroll button handler');
    });
  });

  describe('6. View 2: Curriculum & Levels Components', () => {
    test('6-Tier Ladder Sprint card is present', () => {
      assert.ok(html.includes('startPlacementLadder()'), 'Start 6-tier sprint button');
    });

    test('All 6 CEFR ladder stages (01 to 06) exist with startLesson handlers', () => {
      for (let i = 0; i <= 5; i++) {
        assert.ok(html.includes(`startLesson(${i})`), `startLesson(${i}) for Stage ${i + 1}`);
      }
    });

    test('Prep Grammar Detective card is present', () => {
      assert.ok(html.includes('Prep Grammar Detective'), 'Grammar detective title');
      assert.ok(html.includes('Play Grammar Detective 🔍'), 'Grammar detective button');
    });

    test('60-Second Speaking Gym has all sub-elements', () => {
      assert.ok(html.includes('id="speakingCategory"'), 'Speaking category');
      assert.ok(html.includes('id="speakingPromptText"'), 'Prompt text');
      assert.ok(html.includes('id="speakingKeywords"'), 'Keywords');
      assert.ok(html.includes('id="speakingDial"'), 'Countdown dial');
      assert.ok(html.includes('id="speakingActionBtn"'), 'Microphone workout button');
      assert.ok(html.includes('id="speakingModelBox"'), 'Model answer box');
      assert.ok(html.includes('id="speakingModelText"'), 'Model answer text');
    });

    test('Scholarly Vocabulary Vault (3D Flipcard) has all sub-elements', () => {
      assert.ok(html.includes('id="vocabFlipCard"'), 'Flipcard container');
      assert.ok(html.includes('id="vocabWord"'), 'Word');
      assert.ok(html.includes('id="vocabPos"'), 'Part of speech');
      assert.ok(html.includes('id="vocabIpa"'), 'IPA phonetic');
      assert.ok(html.includes('id="vocabDef"'), 'Definition');
      assert.ok(html.includes('id="vocabExample"'), 'Example sentence');
      assert.ok(html.includes('id="vocabCollocations"'), 'Collocations');
      assert.ok(html.includes('id="vocabProgressText"'), 'Card progress text');
      assert.ok(html.includes('markVocabMastered()'), 'Mastery button handler');
    });
  });

  describe('7. View 3: Mastery & Diagnostics Components', () => {
    test('Learning Analytics Hub contains Error Fingerprint & Readiness Index', () => {
      assert.ok(html.includes('id="learningAnalyticsHub"'), 'Analytics container');
      assert.ok(html.includes('id="errorFingerprintList"'), 'Error fingerprint list');
      assert.ok(html.includes('id="readinessScoreContainer"'), 'Readiness score container');
      assert.ok(html.includes('id="readinessStatusBadge"'), 'Readiness status badge');
      assert.ok(html.includes('id="readinessDisclaimerText"'), 'Readiness disclaimer');
      assert.ok(html.includes('refreshLearningAnalyticsUI()'), 'Refresh diagnostic button');
    });

    test('10 Achievement Badges shelf is present', () => {
      assert.ok(html.includes('id="badgeShelf"'), 'Badge shelf container');
    });

    test('Interactive Scenario Simulator contains dilemma and feedback boxes', () => {
      assert.ok(html.includes('id="scenarioTag"'), 'Scenario tag');
      assert.ok(html.includes('id="scenarioTitle"'), 'Scenario title');
      assert.ok(html.includes('id="scenarioProg"'), 'Progress badge');
      assert.ok(html.includes('id="scenarioSituation"'), 'Situation text');
      assert.ok(html.includes('id="scenarioIncoming"'), 'Incoming message text');
      assert.ok(html.includes('id="scenarioPrompt"'), 'Prompt question');
      assert.ok(html.includes('id="scenarioChoices"'), 'Interactive choices grid');
      assert.ok(html.includes('id="scenarioAnalysis"'), 'Register analysis box');
    });
  });

  describe('8. View 4: Campus Community Components', () => {
    test('Prep Module League Standings card is present', () => {
      assert.ok(html.includes('id="moduleSelector"'), 'Module selector dropdown');
      assert.ok(html.includes('id="moduleStandingsContainer"'), 'Standings container');
    });

    test('Prep Proficiency Cup & Speaking Clinics have countdown and RSVP cards', () => {
      assert.ok(html.includes('id="cdDays"'), 'Countdown days');
      assert.ok(html.includes('id="cdHours"'), 'Countdown hours');
      assert.ok(html.includes('id="cdMins"'), 'Countdown minutes');
      assert.ok(html.includes('id="cdSecs"'), 'Countdown seconds');
      assert.ok(html.includes('id="rsvpBtn-coffee-hour"'), 'Coffee hour RSVP');
      assert.ok(html.includes('id="rsvpBtn-debate-gala"'), 'Debate gala RSVP');
      assert.ok(html.includes('id="rsvpBtn-writing-clinic"'), 'Writing clinic RSVP');
    });

    test('Office Hours Q&A Feed has question submit form and live feed list', () => {
      assert.ok(html.includes('id="qaStudentName"'), 'Student name input');
      assert.ok(html.includes('id="qaStudentFaculty"'), 'Student faculty select');
      assert.ok(html.includes('id="qaQuestionText"'), 'Question text input');
      assert.ok(html.includes('id="qaFeedList"'), 'Q&A feed list container');
    });

    test('Prep School Champions Leaderboard has crown spotlight, score post strip, and table', () => {
      assert.ok(html.includes('id="spotlightChampName"'), 'Spotlight champion name');
      assert.ok(html.includes('id="spotlightChampMeta"'), 'Spotlight champion meta');
      assert.ok(html.includes('id="leaderboardInputName"'), 'Score post name input');
      assert.ok(html.includes('id="leaderboardSelectFaculty"'), 'Score post faculty select');
      assert.ok(html.includes('id="claimCurrentXpEcho"'), 'Active XP display');
      assert.ok(html.includes('id="leaderboardTableHead"'), 'Table header');
      assert.ok(html.includes('id="leaderboardBody"'), 'Table body container');
    });

    test('Campus Slang, Fortune, and Student Voice Poll are present', () => {
      assert.ok(html.includes('id="cultureBadge"'), 'Culture badge');
      assert.ok(html.includes('id="cultureLiteral"'), 'Literal translation');
      assert.ok(html.includes('id="cultureEnglish"'), 'Real English meaning');
      assert.ok(html.includes('id="cultureNote"'), 'Culture humor note');
      assert.ok(html.includes('id="fortuneText"'), 'Fortune text display');
      assert.ok(html.includes('id="pollNotice"'), 'Poll notice display');
      assert.ok(html.includes('id="ideaTitle"'), 'Idea title input');
      assert.ok(html.includes('id="ideaCat"'), 'Idea category select');
      assert.ok(html.includes('id="ideaDesc"'), 'Idea description input');
      assert.ok(html.includes('id="communityIdeasList"'), 'Community ideas list');
    });

    test('Official Digital Student Member Pass Generator is present', () => {
      assert.ok(html.includes('id="memberInputName"'), 'Member name input');
      assert.ok(html.includes('id="memberInputId"'), 'Member ID input');
      assert.ok(html.includes('id="memberSelectFaculty"'), 'Member module select');
      assert.ok(html.includes('id="memberSelectTrack"'), 'Member club track select');
      assert.ok(html.includes('id="digitalPassCard"'), 'Rendered pass card container');
      assert.ok(html.includes('id="passDisplayName"'), 'Pass display name');
      assert.ok(html.includes('id="passDisplayFaculty"'), 'Pass display module');
      assert.ok(html.includes('id="passDisplayTrack"'), 'Pass display track');
      assert.ok(html.includes('id="passDisplayId"'), 'Pass display ID');
      assert.ok(html.includes('id="passDisplayAvatar"'), 'Pass display avatar');
      assert.ok(html.includes('id="passDisplayMemberNum"'), 'Pass display barcode number');
    });
  });

  describe('9. Screens 2, 3, 4: Map, Game Arena, & Results', () => {
    test('Screen 2 (#screen-map) contains module select cards', () => {
      assert.ok(html.includes('id="screen-map"'), 'Screen map container');
    });

    test('Screen 3 (#screen-game) contains quiz arena elements', () => {
      assert.ok(html.includes('id="screen-game"'), 'Screen game container');
      assert.ok(html.includes('id="lessonTitle"'), 'Lesson title');
      assert.ok(html.includes('id="cefrBadge"'), 'CEFR badge');
      assert.ok(html.includes('id="timerPill"'), 'Timer pill');
      assert.ok(html.includes('id="timerDigits"'), 'Timer digits');
      assert.ok(html.includes('id="qCurrent"'), 'Current question number');
      assert.ok(html.includes('id="qTotal"'), 'Total questions number');
      assert.ok(html.includes('id="timerBar"'), 'Countdown bar');
      assert.ok(html.includes('id="progressBar"'), 'Progress bar');
      assert.ok(html.includes('id="questionTypeTag"'), 'Question type tag');
      assert.ok(html.includes('id="questionSelectionReason"'), 'Selection reason');
      assert.ok(html.includes('id="questionSpecialContent"'), 'Special content container');
      assert.ok(html.includes('id="questionHeading"'), 'Question heading');
      assert.ok(html.includes('id="optionsContainer"'), 'Options container');
      assert.ok(html.includes('id="hintBtn"'), 'Hint button');
      assert.ok(html.includes('id="feedbackBar"'), 'Feedback bar');
      assert.ok(html.includes('id="rationaleBox"'), 'Rationale box');
      assert.ok(html.includes('id="nextQuestionBtn"'), 'Next question button');
    });

    test('Screen 4 (#screen-result) contains result evaluation elements', () => {
      assert.ok(html.includes('id="screen-result"'), 'Screen result container');
      assert.ok(html.includes('id="resultTrophy"'), 'Result trophy');
      assert.ok(html.includes('id="resultHeading"'), 'Result heading');
      assert.ok(html.includes('id="cefrResultBox"'), 'CEFR result box');
      assert.ok(html.includes('id="resultSummaryText"'), 'Result summary text');
      assert.ok(html.includes('id="earnedXPDisplay"'), 'Earned XP display');
      assert.ok(html.includes('id="rankBadgeText"'), 'Rank badge text');
      assert.ok(html.includes('id="downloadReportBtn"'), 'Download report button');
    });
  });

  describe('10. Modals: Faculty Desk, Onboarding, and Data Erasure', () => {
    test('Faculty Desk Modal (#facultyDeskModal) contains all 5 tabs and panes', () => {
      assert.ok(html.includes('id="facultyDeskModal"'), 'Faculty desk modal');
      assert.ok(html.includes('id="tab-roster-btn"'), 'Roster tab button');
      assert.ok(html.includes('id="tab-create-btn"'), 'Create challenge tab button');
      assert.ok(html.includes('id="tab-broadcast-btn"'), 'Broadcast tab button');
      assert.ok(html.includes('id="tab-mondaysheet-btn"'), 'Monday sheet tab button');
      assert.ok(html.includes('id="tab-contenthealth-btn"'), 'Content health tab button');
      assert.ok(html.includes('id="facultyTabPane-roster"'), 'Roster pane');
      assert.ok(html.includes('id="facultyTabPane-create"'), 'Create pane');
      assert.ok(html.includes('id="facultyTabPane-broadcast"'), 'Broadcast pane');
      assert.ok(html.includes('id="facultyTabPane-mondaysheet"'), 'Monday sheet pane');
      assert.ok(html.includes('id="facultyTabPane-contenthealth"'), 'Content health pane');
      assert.ok(html.includes('id="facultyRosterTableBody"'), 'Roster table body');
      assert.ok(html.includes('id="mondaySheetContent"'), 'Monday sheet content container');
      assert.ok(html.includes('id="contentHealthTableBody"'), 'Content health table body');
    });

    test('Onboarding Modal (#onboardingModal) contains level and goal selectors', () => {
      assert.ok(html.includes('id="onboardingModal"'), 'Onboarding modal container');
      assert.ok(html.includes('id="onboardingLevelSelect"'), 'Level select');
      assert.ok(html.includes('id="onboardingGoalSelect"'), 'Goal select');
    });

    test('Data Erasure Modal (#deleteDataModal) contains confirmation buttons', () => {
      assert.ok(html.includes('id="deleteDataModal"'), 'Delete data modal container');
      assert.ok(html.includes('id="confirmDeleteDataBtn"'), 'Confirm delete data button');
    });
  });
});
