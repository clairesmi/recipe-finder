![CS Icon](/recipe-finder/src/assets/favicon.ico) 
# Talk Foodie To Me

This is a web app project that I set myself with the aim of having a first go at using JavaScript’s Web Speech API and using the alternative class component syntax in React (without constructor and manual binding). I also wanted to try working with styled components in React.

The web app enables the user to verbally request recipes based on one or two specified ingredients.

![Talk Foodie screenshot](/recipe-finder/src/assets/main-screenshot.png)

## Deployment

The project is deployed online with Heroku and can be found here:

<insert url here>

## Getting Started

Use the clone button to download the source code. Enter the following commands in the CLI:

<!— To install all the packages listed in the package.json: —> $ yarn 

<!— Run the app on localhost:3000 : —> $ yarn start 

<!— Check the console for any issues and if there are check the package.json for any dependancies missing —>

<!- Navigate to http://localhost:3000/>

## Technologies Used:
JavaScript

React

HTML5

CSS3

Node.js

Axios

Yarn

## External APIs
Recipe Puppy API

## User Experience

The user arrives on the static homepage, where there is a 3-step guide on how to use the app. They must click a button to start their request, say one or two ingredients and then click to find their recipes. 

Their recipe list is then shown and they are able to view five of the recipes or all ten if they click 'Show me More' to expand the page. The Recipe Puppy API provides hyperlinks to the recipe pages so the user can click to open the link in a new tab, or they also have the option to go back to the main page to make another request 

![Recipe View screenshot](/recipe-finder/src/assets/recipe-view.png)


## Error Handling

I had to think about the cases in which a user would specify ingredients that did not exist within the Recipe Puppy database or instances in which they would press find recipes without having said anything. I used a conditional statement to check the length of the recipes array returned or to check the length of the speech array. If the conditions were met then I set requestError to be true which renders a modal to the page giving the user the chance to try again.    

```    
if (!this.state.recipes || this.state.recipes.length === 0 || ingredients.length === 1) {
      this.setState({requestError: true, recipes: null})
      }
  }
  ```
![Error View screenshot](/recipe-finder/src/assets/error-view.png)

I also considered the fact that the user may press 'Find More Recipes' before pressing 'Find Recipes' which would throw an error. So to handle this, I set the state of listening back to false in the resetTranscript function. This function is called when the user presses 'Find More Recipes' so that the user can start again even if they have accidentally pressed the wrong button. 

```
 resetTranscript = () => {
    this.setState({listening: false}, () => {
      this.stopListening()
      this.setState({recipes: null, finalTranscript: '', requestError: false, toggleRecipeDisplay: false})
    })
  }
  ```


## Reflection and Future Improvements

I used Insomnia to test the API, and implemented a componentDidMount for testing so that I could test the recipe page without having to test the speech component every time the page rendered. 

However my next step is to learn how to use Jest for testing with React so that I can test this project and then in future I will have the tools to implement TDD in my work for more robust and better functioning end products.
 