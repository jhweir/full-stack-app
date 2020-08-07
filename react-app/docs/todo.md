# Todos
Last updated: 07-08-2020

+ Re-create PostContext and then remove cascading props to clean up components
- Add holon Id to comments when created
- Add clickoutside approach from drop down menu to other modals
- Add basic mod controls (image upload, name change, handle change)
- show all posts vs direct posts ('post holons' / 'visible handles') ('all contained' vs. 'posted directly to space')
- getHolonPosts run from sidebar buttons but not getHolonData (best approach?)
- Create links between posts
- Include interests and location on register form
- Set up social media log-in strategies
- Multiple choice polls should spread value by number of selected answers (i.e 1 vote = 100 points, 3 votes = 3 * 33.3 points)
- Set up user profiles
    - [x] about page
    - [x] created posts page
    - [ ] settings page
    - [ ] liked posts page
    - [ ] notifications
    - [ ] messages
- set up JWT refresh token (https://www.youtube.com/watch?v=iD49_NIQ-R4&t=9s)
- Re-consider layout/approach used for pie chart and time graph components
- Set up 'visible holons' on post (vs. all included holons)
- Set up verification/welcome emails
- Add privacy setting to labels (public, anonymous etc.)
- create expandable comments
- Holon visualisations
    - Bubble map
    - Radial tree
    - Expandable tree
- Url scrapping
- Location map

# Bugs
- Following/not-following link on holon sidebar not always updating correctly when moving between spaces after a change but before a refresh
- On weighted choice poll vote section: put in answers then move away to results section and come back. numbers have reset to 0 but values are reatined messing up calculations.

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
- work out best approach to paginate posts with filters
    - Time range (All Time, Last Year, Last Month, Last Week, Last 24 hours, Last Hour)
    - Post type (Text, Poll, ...)
    - Sort by (Total Reactions, Total Likes, Total Hearts, Total Ratings, Total Links, ...)
- work out how to get holon stats for sorting ()
- Set up filters on child-holons page
- show all spaces vs direct child spaces ('holon handles' / 'verticle holon relationships') ('all contained spaces' vs. 'only direct descendents')
- Add user to created holons
- Merge title and description into one text field (character limit around 3000)?
- Set up reverse orders for wall filters
