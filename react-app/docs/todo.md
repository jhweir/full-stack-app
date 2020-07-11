# Todos
Last updated: 08-07-2020

+ Take down remaining EC2-ELB services on AWS
- Add user to created holons
- Add basic mod controls (image upload, name change, handle change)
+ work out best approach to paginate posts with filters
    - Store post totals in db to enable/speed up filtered paginated queries? Probably not.
    - Apply filters in query? Probably.
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
+ Re-create PostContext and then remove cascading props to clean up components
- Re-consider layout/approach used for pie chart and time graph components
- Set up 'visible holons' on post (vs. all included holons)
- User authentication/authorization
    - Request FB sign-up
    - Set up verification/welcome emails
- Set up filters on child-holons page
- create seperate Authentication server
- Merge title and description into one text field (character limit around 3000)?
- Add privacy setting to labels (public, anonymous etc.)
- Set up reverse orders for wall filters
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
