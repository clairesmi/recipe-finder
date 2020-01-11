// Set up filter function 
// use handle stop listening to run a function to do api call 
import React, { Component} from 'react';
import axios from 'axios'
import SpeechRecognition from 'react-speech-recognition'

const SpeechRec =  window.webkitSpeechRecognition
const recognition = new SpeechRec()
// console.log(new SpeechRec())

recognition.continous = true
recognition.interimResults = true
recognition.lang = 'en-GB'

class App extends Component {
  state = {
    recipes: null,
    interimTranscript: '',
    finalTranscript: '',
    listening: false,
    requestError: false,
    toggleRecipeDisplay: false,
    loading: false
  }

  // REMOVE AFTER TESTING
  componentDidMount = async () => {
    // console.log(ingredients)
    const res = await axios.post('https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?q=tomatoes')
    console.log(res.data.results)
    this.setState({ recipes: res.data.results })
    this.toggleLoading()
  }

  toggleListen = async () => {
    await this.setState({ listening: !this.state.listening })
    console.log(this.state.listening)
    this.handleListen()
  }

  stopToggleListen = async (e) => {
    e.preventDefault()
    this.stopListening()
    await this.setState({ listening: !this.state.listening })
    this.stopListening()
    // this.searchRecipes()
  }

  handleListen = async (e) => {
    console.log('also listening')
    if (this.state.listening === true) {
      recognition.start()
      recognition.onend = () => recognition.start()
    } else {
      recognition.end()
    }
  
    let finalTranscript = ''
    recognition.onresult = (e) => {
      let interimTranscript = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const transcript = e.results[i][0].transcript;
      console.log(transcript)
      if (e.results[i].isFinal) finalTranscript += transcript + ' ';
      else interimTranscript += transcript;
      }
      this.setState({ interimTranscript })
      this.setState({ finalTranscript })
      // document.querySelector('#interim').innerHTML = interimTranscript
      if (this.state.finalTranscript) { 
        document.querySelector('#final').innerHTML = finalTranscript
      } else {
        return
      }
  
      const finalTranscriptArray = finalTranscript.split(' ')
      const finalText = finalTranscriptArray.join(' ')
      // console.log(finalText)
      document.querySelector('#final').innerHTML = finalText
    }
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }
    console.log(this.state.finalTranscript)
  }

  stopListening = (e) => {
        recognition.stop()
        recognition.onend = () => {
          console.log('i have stopped listening')
      } 
      recognition.onerror = event => {
        console.log("Error occurred in recognition: " + event.error)
      }
      this.searchRecipes()
  }

  searchRecipes = async () => {
    console.log(this.state.finalTranscript)
    // if (this.state.finalTranscript) {
      let ingredients = this.state.finalTranscript.split(' ')
      console.log(ingredients)
      
      if (ingredients.length === 2) {
        try {
          console.log(ingredients)
          const res = await axios.post(`https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?q=${ingredients}`)
          this.setState({ recipes: res.data.results })
          // console.log(res.data.results)
          }

          catch (e) {
            (console.error())
          }
      }
      if (ingredients.length === 3) {
        ingredients = this.state.finalTranscript.split(' ')
        console.log(ingredients)
          try {
            const res = await axios.post(`https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?i=${ingredients[0]}&q=${ingredients[1]}`)
            this.setState({ recipes: res.data.results })
          }
          catch (e) {
            console.error(e)
          }
    }
    // if (ingredients.length === 4) {
    //   ingredients = this.state.finalTranscript.split(' ')
    //   try {
    //     const res = await axios.post(`https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?i=${ingredients[0]},${ingredients[1]}&q=${ingredients[2]}`)
    //     this.setState({ recipes: res.data.results })
    //       }
    //       catch (e) {
    //         console.error(e)
    //       }
    // }
    else if (!this.state.recipes) {
      await this.setState({requestError: true})
      console.log(this.state.requestError) // use this state to put an error message up for the user (alert)
      console.log(this.state.recipes)
      }
      this.toggleLoading()
  }

  toggleLoading = () => {
    this.setState({loading: !this.state.loading})
    console.log(this.state.loading)
    setTimeout(() => {this.setState({loading: !this.state.loading})}, 7000)
  }

  resetTranscript = () => {
    this.setState({recipes: null})
    this.setState({finalTranscript: ''})
    this.toggleLoading()
  }

  toggleRecipeDisplay = () => {
    this.setState({toggleRecipeDisplay: !this.state.toggleRecipeDisplay})
  }

  render() {
    console.log(this.state.loading) 
    const { finalTranscript, recipes, toggleRecipeDisplay, toggleLoading} = this.state
    const firstFiveRecipes = recipes ? recipes.slice(0, 5) : null
    return (
      <div style={pageWrapper}>
        <div style={header}>
        <h1>Talk Foodie to Me</h1>
      </div>
      <div style={pageWelcome}>
      Hello! Welcome to Talk Foodie to Me. To use the site, click on START TALKING, say ONE or TWO ingredients, then when you're finished
      click on FIND RECIPES!
      </div>
      <div style={pageContent}>
        <div className="speech-rec" style={inner_elements}>
      {/* <span>{this.transcript}</span> */}
        <button id='microphone-btn' style={button} onClick={this.toggleListen}>START TALKING</button>
        <button id='microphone-btn' style={button} onClick={this.stopToggleListen}>FIND RECIPES</button>
        <button onClick={this.resetTranscript} style={button}>START AGAIN</button>
        {/* <div id='interim' style={interim}>{interimTranscript} </div> */}
        </div>
        <div id='final' style={final}>{finalTranscript}</div>
        
      </div>
      {!toggleLoading &&
      <>
      <div style={recipeShow}>
        Recipes
      {recipes &&
      <div className="five-recipes">
      {firstFiveRecipes.map((recipe, i) => (
        <>
              <label key={i}>
                <a href={recipe.href} rel="noopener noreferrer" target="_blank">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.ingredients}</p>
                </a> 
              </label> 
            </>
            ))}
            </div>
            }
            {!toggleRecipeDisplay && <button onClick={this.toggleRecipeDisplay}>Show me more</button>}

            {recipes && toggleRecipeDisplay &&
            <div className="ten-recipes">
              {recipes.map((recipe, i) => (
                <>
              <label key={i}>
                <a href={recipe.href} rel="noopener noreferrer" target="_blank">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.ingredients}</p>
                </a> 
              </label> 
              </>
            ))}
            <button onClick={this.toggleRecipeDisplay}>Show less</button>
            </div>
            }
      </div>
      </>
  }
  {toggleLoading && 
   <div className="loading-screen" style={loading}>
        LOADING SCREEN
      </div>
  }
      </div>
    )
  }
}

export default App

const styles = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    margin: '0px'
  },
  header: {
    border: 'solid black 1px',
    textAlign: 'center'
  },
  pageWelcome: {
    border: 'solid black 1px',
    width: '50vw'
  },
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    border: 'solid black 1px',
    height: '50vh',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '100px',
    height: '100px',
    background: 'lightblue',
    borderRadius: '50%',
    margin: '10px'
  },
  interim: {
    color: 'gray',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    color: 'black',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '50vw'
  },
  recipeShow: {
    border: 'solid black 2px',
    width: '75vw'
  },
  loading: {
    background: 'yellow'
  }
}
const {pageWrapper, header, pageWelcome, pageContent, recipeShow, inner_elements, button, final, loading} = styles 