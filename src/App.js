import React from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/Signin';
import Register from './Components/Register/Register';
import './App.css';

const app = new Clarifai.App({
  apiKey: "e77030b509d54438a1da9f18dea5391a"
 });





const particlesOption = {
  particles: {
    number: {
    value: 50,
    density: {
      enable: true,
      value_area: 800 
    }
     }}}

class App extends React.Component {
  constructor(){
    super()
    this.state= {
      input: '',
      imgUrl:'',
      box:{},
      route: 'signin',
      IsSignedIn: false,
    }
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const imagen = document.getElementById('inputimage')
    const width = Number(imagen.width);
    const height = Number(imagen.height);
    return{
      leftCol:  clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height -(clarifaiFace.bottom_row * height),
    }
  }

  displayFacebox = (box) =>{
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input})
    app.models.predict("e466caa0619f444ab97497640cefc4dc", this.state.input)
    .then((response) =>this.displayFacebox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err + "ohhh noooo"));      
  }   
  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState({IsSignedIn: false})
    } else if (route ==='home'){
      this.setState({IsSignedIn: true})
    }
    this.setState({route: route})
  }      


  render(){
    const { IsSignedIn, imgUrl, route, box, } = this.state;
    return (
      <div className="App">
          <Particles className="particles" params={particlesOption}/>
          <Navigation IsSignedIn={IsSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home' 
          ? <div> 
              <Logo/>
              <Rank/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imgUrl={imgUrl}/>
            </div>
          : ( 
          route === 'signin' 
          ? <SignIn onRouteChange ={this.onRouteChange}/>
          : <Register onRouteChange ={this.onRouteChange}/>
          )
         } 
         
      </div>
    );
  }
}
 
export default App;
