# Todos
Last updated: 22-11-2020

+ Create link preview and modal
+ Create link table
+ Display links on postmap
+ Allow users to vote on links

- Bug: Sort by Date (Descending) not loading all posts
- Add current spaces to repost modal
- Add loading states for each db call in contexts, updated effected functions, and test load-order bugs
- Add mod controls
    - remove parent space
    - remove child space
    - delete space
- Update 'holon' names to 'space' throughout codebase to avoid confusion
- Set up social media log-in strategies
- Protect restircted pages and routes (settings page, image uploads etc.)
- Set up comment replies
- Notifications
- User to user messages
- Add holon Id to comments when created
- Add clickoutside approach from drop down menu to other modals
- getHolonPosts run from sidebar buttons but not getHolonData (best approach?)
- Create links between posts
- Include interests and location on register form
- Multiple choice polls should spread value by number of selected answers? (i.e 1 vote = 100 points, 3 votes = 3 * 33.3 points)
- User profiles
    - Settings
    - Liked posts
    - Notifications
    - Messages
- set up JWT refresh token (https://www.youtube.com/watch?v=iD49_NIQ-R4&t=9s)
- Re-consider layout/approach used for pie chart and time graph components
- Set up verification/welcome emails
- Add privacy setting to labels (public, anonymous etc.)
- create expandable comments
- Holon, post, and user visualisations
    - Bubble map
    - Radial tree
    - Expandable tree
- Location map

# Bugs
- Following/not-following link on holon sidebar not always updating correctly when moving between spaces after a change but before a refresh
- On weighted choice poll vote section: put in answers then move away to results section and come back. numbers have reset to 0 but values are retained messing up calculations.

# Complete
- Prevent PostHolon duplicates when creating posts
- Improve routing for post and holon pages
- Create time graph for poll results
- Set up color scale on polls and link to results below display
- Create single choice, multiple choice, and weighted choice polls
- Create User context
- Create auth component
- Create user table in database
- Image uploads
- Add user to posts
- Add user to comments
- Add user to likes/hearts/ratings
- Recognise and highlight account likes/hearts/ratings when loading posts
- Prevent double likes/hearts/ratings from the same account
- Remove likes/hearts/ratings
- Request to log in if vote attempt made when logged out
- Only display delete button on posts if own account
- Allow users to follow spaces
- Add followed spaces to user profile
- Set up single image upload modal component for all image uploads
- Create flag image component
- Create cover image component
- Create side bar link components
- Create page header component
- Create modals component
- Take down remaining EC2-ELB services on AWS
- Reorganise component folder structure
- Fix context flow
- User profiles
    - about
    - posts
- work out best approach to paginate posts with filters
    - Time range (All Time, Last Year, Last Month, Last Week, Last 24 hours, Last Hour)
    - Post type (Text, Poll, ...)
    - Sort by (Reactions, Total Likes, Total Hearts, Total Ratings, Total Links, ...)
- work out how to get holon stats for sorting ()
- Set up filters on child-holons page
- Show all spaces vs direct child spaces ('holon handles' / 'verticle holon relationships') ('all contained spaces' vs. 'only direct descendents')
- Add user to created holons
- Merge title and description into one text field (character limit around 3000)?
- Set up reverse orders for wall filters
- Re-create PostContext and then remove cascading props to clean up components
- Change 'isPostPage' prop to 'location' prop ('holon-posts', 'post-page', 'user-created-posts')
- Set up infinite scroll on comments
- Set up reset filter functions for holon and user contexts
- Bug: after new log-in, going to profile page fails and user has to refresh page
- Build scraper for Url posts
- Reposition post-reactions and remove 'hearts'
- Add 'no comments with those settings' placeholder on post page
- Add mod controls
    - handle change
    - name change
    - add new mod
    - add new parent space
- Seperate 'direct' and 'indirect' handles when creating posts then set up option to show all posts vs direct posts
- Set up reaction previews
- Set up reposts
- Bug: Duplicate HolonHandles being created when multiple parent branches added
- Add holon creator to holon data
- Allow users to log in with username or password
- Start building Prism posts
- Add average and individual ratings to rating preview modal
- Create Link type labels in db
- Change 'Labels' table to 'Reactions' (freeing up 'labels' for other uses)
- Set up 'visible holons' on post (vs. all included holons)