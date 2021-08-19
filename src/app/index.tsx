import React, {useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import ModalController from './components/modal-context';

import './index.style.css'
import '@progress/kendo-ui/css/web/kendo.default-v2.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './app';

const OnLoadRenderer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // passed as new container to Modal
  const containerRef = useRef<HTMLDivElement>(null);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);


return(
  <div className='jfa-h-f'>
       <div id="lh-result" className="lhresult mb-2">
  </div>
  </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
    <OnLoadRenderer />
  </React.StrictMode>,
  rootElement
);