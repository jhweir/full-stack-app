# Todos
Last updated: 26-06-2020

+ Take down remaining EC2-ELB services on AWS
- Allow users to follow spaces
- Add followed spaces to user profile
- Add user to create holon
- Include interests and location on register form
- Set up social media log-in strategies
- Set up user profiles
    - about page
    - created posts page
    - settings page
    - liked posts page
    - notifications
    - messages
- only allow post creators to delete posts
- one vote per user
- highlight items user has interacted with
- request to log in if vote attempt made when logged out
- set up JWT refresh token (https://www.youtube.com/watch?v=iD49_NIQ-R4&t=9s)
- Bug: on weighted choice poll vote section. put in answers then move away to results section and come back. numbers have reset to 0 but values are reatined messing up calculations.
+ Re-create PostContext and then remove cascading props to clean up components
- Re-consider layout/approach used for pie chart and time graph components
- Set up 'visible holons' on post (vs. all included holons)
- User authentication/authorization
    - Request FB sign-up
    - Set up verification/welcome emails
+ work out best approach to paginate posts with filters
    - Store post totals in db to enable/speed up filtered paginated queries?
    - Apply filters in query?
- Set up filters on child-holons page
- create seperate Authentication server
- Merge title and description into one text field character limit around 3000?
- Add privacy setting to labels (public, anonymous etc.)
- Set up reverse orders for wall filters
- create expandable comments
- Holon visualisations
    - Bubble map
    - Radial tree
    - Expandable tree
- Url scrapping
- Location map

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
