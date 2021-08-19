import React, { ReactElement } from 'react';
import { ProgressBar } from "@progress/kendo-react-progressbars";


interface LHMetaCard {
  name: string;
  scoreResult: number;
}

export default function LHPanelResult({ name, scoreResult }: LHMetaCard): ReactElement {
	
  return (

<div className="container">
    <div className="row mt-3 mb-4 text-center">
     <div className="col-12">
	    <h2 className="col-12">{name}</h2>
      <ProgressBar value={scoreResult} />
    </div>
  </div>
 </div>
 )
};
