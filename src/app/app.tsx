import React, {useState, useRef} from 'react'

import ModalController from './components/modal-context'
import PanelResult from './components/meta-context';
import * as ReactDOM from "react-dom";
import { useForm } from "react-hook-form";

/*
Object.assign(global, {
    $: jQuery,
    jQuery: jQuery,
});
*/

const App = () => {
  const { register, errors, handleSubmit, clearErrors } = useForm();

  var jquery  = require('jquery');
  
  Object.assign(window, {
    $: jquery,
    jQuery: jquery,
  });

  const onSubmit = (data: any) => {
	  console.log(JSON.stringify(data))
  };
  
  const fetchLHResults = async (data: any): Promise<any> => {
     var response = await fetch('/api/lh?url=' + data.urlTarget)

      if (!response.ok) {
      // alert(`Error on fetching results (HTTP ${response.status})`)
       ReactDOM.render(
        <div className="sda-lhr-sdl">
         <ModalController className={'btn-danger'} dialog={`HTTP error! status: ${response.status}`} name={'Error'} showModalOnload={true}/>
        </div>, document.getElementById('lh-result')
         );
     } else if(response.ok) {
         var LH_RESULT = await response.json();

         var LH_PERF_RESULT = parseInt(
           (Math.round(LH_RESULT.categories.performance.score * 10000) / 100)
           .toFixed(0)
           );
         var LH_ACCESIBILITY_RESULT = parseInt(
           (Math.round(LH_RESULT.categories.accessibility.score * 10000) / 100)
           .toFixed(0)
           );
         var LH_BPRACTICES_RESULT = parseInt(
           (Math.round(LH_RESULT.categories['best-practices'].score * 10000) / 100)
           .toFixed(0)
           );
         var LH_SEO_RESULTS = parseInt(
           (Math.round(LH_RESULT.categories.seo.score * 10000) / 100)
           .toFixed(0)
           );
         var LH_PWA_RESULTS = parseInt(
           (Math.round(LH_RESULT.categories.pwa.score * 10000) / 100)
           .toFixed(0)
           );
 
        Object.assign(global, {
          LH_RESULT: LH_RESULT,
          LH_PERF_RESULT: LH_PERF_RESULT,
          LH_ACCESIBILITY_RESULT: LH_ACCESIBILITY_RESULT,
          LH_BPRACTICES_RESULT: LH_BPRACTICES_RESULT,
          LH_SEO_RESULTS: LH_SEO_RESULTS,
          LH_PWA_RESULTS: LH_PWA_RESULTS
        });
          console.log('Performance: ', LH_PERF_RESULT)
          console.log('Accesibility: ', LH_ACCESIBILITY_RESULT)
          console.log('Best-Practices: ', LH_BPRACTICES_RESULT)
          console.log('SEO: ', LH_SEO_RESULTS)
          console.log('PWA: ', LH_PWA_RESULTS)
          // <PanelResult name={lhResult.categories.performance.title} scoreResult={lhResult.categories.performance.score * 100} />
          // <PanelResult name={lhResult.categories.accessibility.title} scoreResult={lhResult.categories.accessibility.score *100} /> 
          ReactDOM.render(
          <div className="sda-lhr-sdl">
            <div className='lh-report-res-url mb-2 text-center mt-5'>Results for {data.urlTarget}</div>
            {LH_RESULT.runtimeError ? 
              <div className='bg-danger rounded lh-issues mt-3'><strong className={'text-white'}>{LH_RESULT.runtimeError.message} (code: {LH_RESULT.runtimeError.code})</strong></div> : null
            }
            <PanelResult name='Performance' scoreResult={LH_PERF_RESULT} />
            <PanelResult name='Accesibility' scoreResult={LH_ACCESIBILITY_RESULT} />
            <PanelResult name='Best-Practices' scoreResult={LH_BPRACTICES_RESULT} />
            <PanelResult name='SEO' scoreResult={LH_SEO_RESULTS} />
            <PanelResult name='PWA' scoreResult={LH_PWA_RESULTS} />
            <ModalController showModalOnload={false} name={'View report'} dialog={<iframe src={`http://${window.location.hostname}:${window.location.port}/statics/lh-report/lhreport.html`} frameBorder="0" scrolling="auto" height="460px" width="100%"></iframe>} className={'show-lh-details btn-info'}/>
        </div>, document.getElementById('lh-result')
        )
     }		 
  };

  React.useEffect(() => {
    // validate onMount
    document.body.classList.add('bg-light');
    handleSubmit(onSubmit)();
    // eslint-disable-next-line async (data: any) => await fetch(`./api/lh?url=${data.urlTarget}`)
  }, []);

  return (
    <form onSubmit={handleSubmit(fetchLHResults)}>
      <label className='text-dark'>URL to enter</label>
      <input name="urlTarget" className='form-control mb-2' type="text" ref={register({ required: true })} />
      {errors.urlTarget && <p>This Field is Required</p>}
      <button className='btn-container' type="button" onClick={() => clearErrors()}>
        Clear All Errors
      </button>
      <input className={'mb-3'} type="submit" />
    </form>
    
  );
};

export default App;
