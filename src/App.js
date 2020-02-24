import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Input, Form } from 'antd';
import { useLocalStore } from 'mobx-react-lite';
import { AppLink } from './AppLink.tsx';

function App() {
  const formData = useLocalStore(() => (
    <MobxFormData>
      <MobxFieldData name="userName" value="joe_sky" type="string" required />
    </MobxFormData>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <AppLink showText={true} />
        <MobxObserver>
          <Form.Item n-mobxField={formData.userName}>
            <Input n-mobxBind={formData.userName} />
          </Form.Item>
        </MobxObserver>
      </header>
    </div>
  );
}

export default App;
