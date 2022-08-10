import '../App.scss'

import React, { useEffect, useState } from 'react'
import green from '../accets/green.gif'
import dog from '../accets/dog.png'
import classNames from 'classnames'

const Field = (props) => {
  const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const { multipliers } = props
  const [number, setNumber] = useState('_')
  const [multiplier, setMultiplier] = useState(multipliers[0])
  const [product, setProduct] = useState('')
  // score settings
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [showLearn, setShowLearn] = useState(false)

  //for animation only
  const [rightAnswer, setRightAnswer] = useState(false)
  const [answer, setAnswer] = useState('neutral')

  // some paires a mor difficlt then others
  // they will be saved to dif arr
  const [startTime, setStartTime] = useState('')
  const [thinkTime, setThinkTime] = useState('')
  const [barTime, setBarTime] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [hardOnes, setHardOnes] = useState([])
  const difIni = {
    2: new Array(10).fill(1),
    3: new Array(10).fill(1),
    4: new Array(10).fill(1),
    5: new Array(10).fill(1),
    6: new Array(10).fill(1),
    7: new Array(10).fill(1),
    8: new Array(10).fill(1),
    9: new Array(10).fill(1),
  }

  const [dif, setDif] = useState(difIni)

  const updateDif = (mult, n, isEasy) => {
    const newDif = dif[mult].map((el, i) => {
      if (isEasy) {
        if (i === n && el > 1) el--
      } else {
        if (i === n && el < 4) el++
      }
      return el
    })
    setDif((prevState) => ({
      ...dif,
      [mult]: newDif,
    }))
    console.log('updateDif dif', dif)
  }

  //if two multipliers active get one by random
  const randomMultiplier = () => {
    const randomIndex = Math.floor(Math.random() * multipliers.length)
    setMultiplier(multipliers[randomIndex])
  }
  useEffect(() => {
    randomMultiplier()
    setNumber(countNewNumber(multiplier))
    
  }, [multipliers])

  const countNewNumber = (mult) => {
    let newArr = []
    console.log('dif[mult]', dif[mult])
    dif[mult].map((el, i) => {
      const arr = new Array(el*1).fill(i)
      console.log('arr', arr)
      newArr.push(...arr)
    })
    console.log('newArr', newArr)
    let newRandom = Math.ceil(Math.random() * (newArr.length - 1))
    let newNumber = newArr[newRandom]
    if (newNumber === number) newNumber = newArr[ Math.ceil(Math.random() * (newArr.length - 1))]
    return newNumber
  }

  const start = () => {
    if (answer === 'bad') return null
    randomMultiplier()
    setNumber(countNewNumber(multiplier))
    setStartTime(new Date().getTime())
  }

  const done = () => {
    if (multiplier * Number(number) === Number(product)) {
      setRightAnswer(true)
      setScore(score + 1)
      setThinkTime(((new Date().getTime() - startTime) / 1000).toFixed(1))
      setAnswer('good')
      if (((new Date().getTime() - startTime) / 1000).toFixed(1) > 15){
        updateDif(multiplier, number, false)
      } 
      if (((new Date().getTime() - startTime) / 1000).toFixed(1) < 4 ) {
        updateDif(multiplier, number, true)
      }
      
      setTimeout(() => {
        setProduct('')
        // setMultiplier('_')
        setRightAnswer(false)
        setAnswer('neutral')
        start()
      }, 1000)
    } else {
      setAnswer('bad')
      setMistakes(mistakes + 1)
      setTimeout(() => {
        setProduct('')
        setAnswer('neutral')
      }, 1000)

      updateDif(multiplier, number, false)

      console.log('dif updateDif', dif)
    }
  }
  // show hard questions
  const hardQ = () => {
    console.log('arr hard', dif)
    // const arrDif = new Array(dif)
    const hardQuestions = []
    for (const mult in dif){
      for (let i=0; i<11; i++){
        if (dif[mult][i] > 1)hardQuestions.push(`${mult}  X  ${i}  =  ${i*mult}`)
      }
    }  
    setHardOnes(hardQuestions)
    setShowLearn(!showLearn)
    setPopupOpen(false)
    
  }
  
  const handleStartTimer = (min) => {
   
    min === '5' ? setBarTime('5min') : setBarTime('2min')
    setTimeout(() => {
      hardQ()
      setPopupOpen(true)
      setBarTime(false)
    }, min * 60000)
  }

  // little animation for good and bad answers
  const successClass = rightAnswer ? 'success visible' : 'success'

  const answerClass = classNames({
    answer: answer === 'neutral',
    'answer bad': answer === 'bad',
    'answer good': answer === 'good',
  })

  const popupClass = popupOpen ? 'popup open' : 'popup'

  const barClass = classNames('bar', {
    two_min: barTime === '2min',
    five_min: barTime === '5min',
  })

  const learnClass = showLearn ? 'learn show' : 'learn'
 

  return (
    <>
      <div className="field">
        <div className="container_img">
          <img src={green} className={successClass} />
        </div>
        <div className="round-time-bar">
          <div className={barClass}></div>
        </div>
        <div className="timercontainer">
          {/* <select onChange={(e) => handleStartTimer(e)}>
            <option value={''}> -- Choose timer --</option>
            <option value={'2'}> Start 2 min timer</option>
            <option value={'5'}> Start 5 min timer</option>
          </select> */}
          <div className={popupClass}>
            {/* <img src={dog} className='dog'/> */}
            <h1> Time is up!</h1>
            <h3> Your score: {score}</h3>mistakes
            <h3> Missed: {mistakes}</h3>
            <button onClick={() => setPopupOpen(false)}>Close</button>
            { hardOnes.length > 0 && <button onClick={() =>  hardQ()}>Learn the missed!</button>}
           
          </div>

         
        </div>

        <div className="container_quest">
        {barTime === false &&  
          <button onClick={() => handleStartTimer(2)} className="next_done">
           <i className="fa fa-forward" aria-hidden="true"></i>
          </button>}
          
          <div className="question">
            {multiplier} X {number} =
          </div>
          <div className={answerClass}>{product}</div>
          <button onClick={() => done()} className="next_done">
            <i className="fa fa-check-square-o"></i>
          </button>
        </div>

        <div className="container_keys">
          {buttons.map((n, i) => {
            return (
              <button
                key={i}
                onClick={() => setProduct(`${product}${n}`)}
                className="numb"
              >
                {n}
              </button>
            )
          })}
          <button
            onClick={() => setProduct(product.substring(0, product.length - 1))}
          >
            X
          </button>
        </div>
        <div>
            Your Score is {score}
            {/* <br />{thinkTime} */}
        </div>
        <div onClick={() => hardQ()}>Some hard to remember questions <i className="fa fa-eye" aria-hidden="true"  ></i></div>
        {hardOnes.length > 0 && <div className={learnClass}>
          
          <h1>Just remember those!</h1>
          {hardOnes.map((el, i) => {
            return(<div key={i}>{el}</div>)
          })}
          <div className='close' onClick={() => setShowLearn(false)}>Close X</div>
        </div>}
       
         
          <img src={dog} className='footer_dog'/>
        
      </div>
     
    </>
  )
}
export default Field
