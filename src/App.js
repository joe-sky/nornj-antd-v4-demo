import React from 'react';
import 'nornj-react';
import logo from './logo.svg';
import './App.css';
import { Input, Form } from 'antd';
import { useLocalStore } from 'mobx-react-lite';
import { AppLink } from './AppLink.tsx';

function App() {
  const { formData } = useLocalStore(() => (
    <mobxFormData>
      <mobxFieldData name="userName" value="joe_sky" required min={3} max={10} />
    </mobxFormData>
  ));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <AppLink showText={true} />
        <section>
          <Form.Item label="User Name:" mobxField={formData.userName}>
            <Input />
          </Form.Item>
        </section>
      </header>
    </div>
  );
}

export default App;
