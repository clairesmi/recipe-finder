// Set up filter function 
// use handle stop listening to run a function to do api call 
import React, { Component} from 'react';
import axios from 'axios'
import SpeechRecognition from 'react-speech-recognition'

import './App.css'

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
  }

  // REMOVE AFTER TESTING
  // componentDidMount = async () => {
  //   // console.log(ingredients)
  //   const res = await axios.post('https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?q=tomatoes')
  //   console.log(res.data.results)
  //   this.setState({ recipes: res.data.results })
  //   this.toggleLoading()
  // }

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
          console.log('not listening')
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
  }

  // toggleLoading = () => {
  //   this.setState({loading: !this.state.loading})
  //   console.log(this.state.loading)
  //   setTimeout(() => {this.setState({loading: !this.state.loading})}, 7000)
  // }

  resetTranscript = () => {
    this.setState({recipes: null})
    this.setState({finalTranscript: ''})
    this.setState({requestError: false})
    // this.toggleLoading()
  }

  toggleRecipeDisplay = () => {
    this.setState({toggleRecipeDisplay: !this.state.toggleRecipeDisplay})
  }

  render() {
    console.log(!this.state.requestError) 
    const { finalTranscript, recipes, toggleRecipeDisplay, requestError} = this.state
    const firstFiveRecipes = recipes ? recipes.slice(0, 5) : null
    return ( 
      <div className='main-wrapper' style={main}>
        <div style={!requestError ? pageWrapper: outerModal}>
          <div className='header' style={header}>
            <h1 style={headerText}>Talk Foodie to Me</h1>
          </div>
              <div className='underline' style={underLine}></div>
      <div style={pageWelcome}>
        <p>
      Hey! Welcome to Talk Foodie to Me. To use the site: <br/>
      1. Click on SAY INGREDIENTS, <br/>
      2. Say ONE or TWO ingredients<br/>
      3. Click on FIND RECIPES and scroll down to view your recipes!
        </p>
      </div>
      <div style={pageContent}>
        <div className="speech-rec" style={inner_elements}>
      {/* <span>{this.transcript}</span> */}
        <button id='microphone-btn' style={buttonOne} onClick={this.toggleListen}>SAY INGREDIENTS</button>
        <button id='microphone-btn' style={buttonTwo} onClick={this.stopToggleListen}>FIND RECIPES</button>
        <button onClick={this.resetTranscript} style={buttonThree}>START AGAIN</button>
        {/* <div id='interim' style={interim}>{interimTranscript} </div> */}
        </div>
        <div style={transcriptLabel}>You asked for recipes for:</div>
        <div id='final' style={final}>{finalTranscript}</div>
        
      </div>
      <>
      <div style={recipeShow}>
      {recipes &&
      <div className="five-recipes">
      Recipes
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
            {!toggleRecipeDisplay && <button onClick={this.toggleRecipeDisplay}>Show me more</button>}
            </div>
            }

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
      </div>
        {requestError &&
          <div style={innerModal}>Oops, something went wrong!
          <button onClick={this.resetTranscript}>Try Again</button>
          </div>}
    </div>
    )
  }
}

export default App

const styles = {
  main: {
    // height: '120vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'center',
    color: '#EBE5E4'
  },
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '15px'
  },
  header: {
    textAlign: 'center',
    fontFamily: 'Carrois Gothic SC, sans-serif',
    fontSize: '50px',
    fontWeight: 'light',
    color: '#FF5001'
  },
  headerText: {
    margin: '10px'
  },
  underLine: {
    border: 'solid grey 1px',
    width: '80vw'
  },
  pageWelcome: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '20px',
    width: '75vw',
    fontFamily: 'Oswald, sans-serif',
    fontSize: '25px',
    color: '#120002'
  },
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonOne: {
    width: '120px',
    height: '120px',
    background: '#F8F272',
    border: 'grey',
    borderRadius: '50%',
    margin: '20px',
    // fontSize: '12px',
    fontWeight: 'bold',
    boxShadow: '0px 0px 15px 0px'
  },
  buttonTwo: {
    width: '120px',
    height: '120px',
    background: '#94FBAB',
    borderRadius: '50%',
    margin: '20px',
    // fontSize: '13px',
    fontWeight: 'bold',
    boxShadow: '0px 0px 15px 0px'
  },
  buttonThree: {
    width: '120px',
    height: '120px',
    background: '#F4989C',
    borderRadius: '50%',
    margin: '20px',
    // fontSize: '13px',
    fontWeight: 'bold',
    boxShadow: '0px 0px 15px 0px'
  },
  transcriptLabel: {
    color: '#120002',
    fontFamily: 'Oswald, sans-serif',
    fontSize: '25px',
    marginTop: '10px',
  },
  final: {
    color: 'black',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '50vw'
  },
  recipeShow: {
    width: '75vw'
  },
  outerModal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0px',
    opacity: '0.5'
  },
  innerModal: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    height: '70vh',
    width: '70vw',
    backgroundColor: 'green',
    opacity: '1.0',
    border: 'solid grey 1px',
    zIndex: '5',
    position: 'absolute',
    marginTop: '60px',
    boxShadow: '0px 2px 10px 0px' 
  },
}
const {main, pageWrapper, header, headerText, underLine, pageWelcome, pageContent, recipeShow, 
  inner_elements, buttonOne, buttonTwo, buttonThree, transcriptLabel, final, outerModal, innerModal} = styles