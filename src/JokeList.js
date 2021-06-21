import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


class JokeList extends React.Component{
  constructor(props){
    super(props)
    this.state= {
      jokes:[]
    }
    this.generateNewJokes = this.generateNewJokes.bind(this)
    this.vote = this.vote.bind(this)
  }

  componentDidMount = async ()=>{
    let j = [...this.state.jokes]
    let seenJokes = new Set()
    try{
      while(j.length < this.props.numJokesToGet){
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        })

        let {status,...jokeObj} = res.data

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState(prevState => ({
        ...prevState,
        jokes:j
      }))
    }catch(e){
      console.log(e)
    }
  }

  componentDidUpdate = async ()=>{
    let j = [...this.state.jokes]
    let seenJokes = new Set()
    try{
      while(j.length < this.props.numJokesToGet){
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        })

        let {status,...jokeObj} = res.data

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState(prevState => ({
        ...prevState,
        jokes:j
      }))
    }catch(e){
      console.log(e)
    }
  }

  generateNewJokes (){
    this.setState(prevState =>({jokes:[]}))
  }

  vote (id, delta){
    this.setState(allJokes => ({
      jokes:allJokes.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))}))
  }

  render(){

    const hasJokes = this.state.jokes.length !== 0
    
    if(hasJokes){
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
      return(
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
      </div>
      )
    }

    return (
      <h1>Loading...</h1>
    )
  }
}

JokeList.defaultProps = {
  numJokesToGet : 10
}

export default JokeList;
