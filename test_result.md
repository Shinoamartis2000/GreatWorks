#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================
## user_problem_statement: "Redesign the existing GreatWorks Foundation NGO website into an official, institutionally credible, government-compatible public-sector style website. Restrained/evidence-based design, no fabricated stats/registration/partners. Government-style header (utility bar, accessibility controls, search), institutional identity, hero 'Working Together for Sustainable Community Development', announcement strip, key indicators, About (mission/vision/values/leadership), Programs, Projects directory with filters, Impact, Publications document library, Partnerships (segmented), Contact (segmented enquiries + map), institutional footer with legal bar, breadcrumbs, WCAG-conscious accessibility, subtle animations. Existing admin CMS must remain functional."

## frontend:
##   - task: "Institutional redesign: navigation, utility bar, accessibility controls (text resize + contrast), site search"
##     implemented: true
##     working: "NA"
##     file: "components/Navbar.jsx, components/Footer.jsx, index.css, tailwind.config.js"
##   - task: "Home institutional layout (hero, verified-facts panel, announcements, indicators, programmes, projects, CTA)"
##     implemented: true
##     working: "NA"
##     file: "pages/Home.jsx"
##   - task: "New pages: Programs, Projects (filters+detail dialog), Impact, Publications (doc library), Partnerships, Search"
##     implemented: true
##     working: "NA"
##     file: "pages/Programs.jsx, pages/Projects.jsx, pages/Impact.jsx, pages/Publications.jsx, pages/Partnerships.jsx, pages/Search.jsx"
##   - task: "Redesigned About, Contact (segmented + map), Donate, GetInvolved, Stories(News), Gallery"
##     implemented: true
##     working: "NA"
##     file: "pages/About.jsx, pages/Contact.jsx, pages/Donate.jsx, pages/GetInvolved.jsx, pages/Stories.jsx, pages/Gallery.jsx"

## metadata:
##   run_ui: true

## test_plan:
##   current_focus:
##     - "Public navigation across all 8 nav items + Home + Donate"
##     - "Projects filters and detail dialog"
##     - "Publications tabs / document library"
##     - "Contact, Donate, Volunteer, Newsletter form submissions"
##     - "Site search and accessibility controls"

## agent_communication:
##     -agent: "main"
##     -message: "Full institutional redesign of public site completed. Backend unchanged; forms reuse existing endpoints (/contact, /donations, /volunteers, /newsletter, /events, /posts, /programs, /annual-reports, /reports). Please test all public flows (frontend only). Admin CMS at /admin unchanged but confirm it still loads."
