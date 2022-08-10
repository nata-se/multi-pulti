import React, { useState } from 'react'
import './App.scss'
import Field from './components/Field'

import TimesButtons from './components/TimesButtons'

function App() {
  const [multipliers, setMultipliers] = useState([8])

  return (
    <div className="App">
      <TimesButtons setMultipliers={setMultipliers} multipliers={multipliers} />
      <Field multipliers={multipliers} />
    </div>
  )
}

export default App
