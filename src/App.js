import React, { Component} from 'react';
import axios from 'axios'

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
  // }

  toggleListen = () => {
    this.setState({ listening: !this.state.listening }, () => {
      this.handleListen()
      // console.log(this.state.listening)
    })
  }

  stopToggleListen = (e) => {
    e.preventDefault()
    this.setState({ listening: !this.state.listening }, () => {
      this.stopListening()
      // console.log(this.state.listening)
    })
  }

  handleListen = async (e) => {
    console.log('now listening')
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
      console.log(ingredients.length)
      
      if (ingredients.length === 2) {
        try {
          // console.log(ingredients)
          const res = await axios.post(`https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?q=${ingredients}`)
          this.setState({ recipes: res.data.results })
          // console.log(res.data.results)
          }

          catch (err) {
            console.log(err)
          }
      }
      if (ingredients.length === 3) {
        ingredients = this.state.finalTranscript.split(' ')
        // console.log(ingredients)
          try {
            const res = await axios.post(`https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api/?i=${ingredients[0]}&q=${ingredients[1]}`)
            this.setState({ recipes: res.data.results })
          }
          catch (err) {
            console.log(err)
          }
    }
    
    // if (recipes.length)
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
    if (!this.state.recipes || this.state.recipes.length === 0 || ingredients.length === 1) {
      this.setState({requestError: true, recipes: null})
      }
  }

  resetTranscript = () => {
    this.setState({listening: false}, () => {
      this.stopListening()
      this.setState({recipes: null, finalTranscript: '', requestError: false, toggleRecipeDisplay: false})
      // console.log(this.state.listening)
    })
  }

  toggleRecipeDisplay = () => {
    this.setState({toggleRecipeDisplay: !this.state.toggleRecipeDisplay})
  }

  render() {
    console.log(!this.state.requestError) 
    const { finalTranscript, recipes, toggleRecipeDisplay, requestError} = this.state
    const firstFiveRecipes = recipes ? recipes.slice(0, 5) : null
    const lastFiveRecipes = recipes ? recipes.slice(5, 10) : null
    return ( 
      <div className='main-wrapper' style={main}>
        {!recipes &&
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
        <button onClick={this.resetTranscript} style={buttonThree}>FIND MORE RECIPES</button>
        {/* <div id='interim' style={interim}>{interimTranscript} </div> */}
        </div>
        <div style={transcriptLabel}>You asked for recipes for:</div>
        <div id='final' style={final}>{finalTranscript}</div>
        
      </div>
      </div>
      }
      {recipes &&
      <div style={recipeWrapper} id='recipes' className='recipes'>
      
      <div style={recipeShow}>
      {recipes &&
      <div style={recipeList} className="five-recipes">
      <button onClick={this.resetTranscript} style={buttonFour}>Go Back</button>
        <h1 style={recipeHeader}>
      Recipes</h1>
      <div className='underline' style={underLine}></div>
      {firstFiveRecipes.map((recipe, i) => (
        <>
              {/* <label key={i}> */}
                <a key={i} href={recipe.href} rel="noopener noreferrer" target="_blank">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.ingredients}</p>
                </a> 
              {/* </label>  */}
            </>
            ))}
            {!toggleRecipeDisplay && <button onClick={this.toggleRecipeDisplay} style={buttonFour}>Show me more</button>}
            </div>
            }

            {recipes && toggleRecipeDisplay &&
            <div style={recipeList} className="ten-recipes">
              {lastFiveRecipes.map((recipe, i) => (
                <>
                <a key={i} href={recipe.href} rel="noopener noreferrer" target="_blank">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.ingredients}</p>
                </a> 
              </>
            ))}
            <button onClick={this.toggleRecipeDisplay} style={buttonFour}>Show less</button>
            </div>
            }
           
      </div>
      
      </div>
      }
        {requestError &&
          <div style={innerModal}>Oops, something went wrong!
          <button onClick={this.resetTranscript} style={buttonOne}>Try Again</button>
          </div>}
    </div>
    )
  }
}

export default App

const styles = {
  main: {
    // height: '200vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
    alignItems: 'center',
    // backgroundColor: '#EBE5E4',
    // backgroundSize: 'cover'
  },
  pageWrapper: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    alignItems: 'flexStart',
    justifyContent: 'center',
    paddingTop: '15px'
  },
  header: {
    fontFamily: 'Carrois Gothic SC, sans-serif',
    fontSize: '50px',
    fontWeight: 'light',
    color: '#FA7921'
  },
  headerText: {
    margin: '10px',
    padding: '10px',
  },
  underLine: {
    border: 'solid grey 1px',
    width: '80vw'
  },
  pageWelcome: {
    display: 'flex',
    justifyContent: 'flexStart',
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
    alignItems: 'flexStart',
    // backgroundColor: '#EBE5E4'
  },
  buttonOne: {
    width: '120px',
    height: '120px',
    background: '#F8F272',
    border: 'grey',
    borderRadius: '50%',
    margin: '30px',
    // fontSize: '12px',
    fontWeight: 'bold',
    boxShadow: '0px 0px 15px 0px',
    // padding: '10px',
  },
  buttonTwo: {
    width: '120px',
    height: '120px',
    background: '#94FBAB',
    borderRadius: '50%',
    margin: '30px',
    // fontSize: '13px',
    fontWeight: 'bold',
    boxShadow: '0px 0px 15px 0px',
    // padding: '10px',
  },
  buttonThree: {
    width: '120px',
    height: '120px',
    background: '#F4989C',
    borderRadius: '50%',
    margin: '30px',
    // fontSize: '9px',
    fontWeight: 'bold',
    boxShadow: '0px 0px 15px 0px',
    // padding: '10px',
  },
  buttonFour: {
    width: '80px',
    height: '30px',
    background: '#49D49D',
    color: 'white',
    borderRadius: '10%',
    marginTop: '0px',
    marginRight: '60px',
    // marginBottom: '20px',
    fontWeight: 'bold',
    boxShadow: '0px 0px 15px 0px',
    // padding: '10px',
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
  recipeWrapper: {
    display: 'flex',
    padding: '20px',
    // flexDirection: 'column',
    justifyContent: 'center',
    // height: '100vh',
  },
  recipeHeader: {
    textAlign: 'left',
    fontFamily: 'Carrois Gothic SC, sans-serif',
    fontSize: '100px',
    fontWeight: 'heavy',
    color: '#FA7921',
    margin: '10px'
  },
  recipeShow: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '75vw',
  },
  recipeList: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Oswald, sans-serif',
    fontSize: '15px',
    color: '#EBE5E4'
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
    alignItems: 'center',
    justifyContent: 'center',
    height: '65vh',
    width: '60vw',
    backgroundColor: '#EBE5E4',
    opacity: '1.0',
    border: 'solid grey 1px',
    zIndex: '5',
    position: 'absolute',
    marginTop: '100px',
    boxShadow: '0px 2px 10px 0px',
    textAlign: 'center',
    fontFamily: 'Carrois Gothic SC, sans-serif',
    fontSize: '50px',
    fontWeight: 'light',
    color: '#FF5001'
  },
}
const {main, pageWrapper, header, headerText, underLine, pageWelcome, pageContent, recipeWrapper, recipeHeader, recipeShow, 
  recipeList, inner_elements, buttonOne, buttonTwo, buttonThree, buttonFour, transcriptLabel, final, outerModal, innerModal} = styles