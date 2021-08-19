import React, {useRef, useState, ReactElement} from 'react';
import ReactDOM from 'react-dom';

import { Modal, Button } from "react-bootstrap";
import styled from 'styled-components'


interface ModalType {
  className?: string,
  name: string,
  showModalOnload?: boolean,
  dialog: any
}

export default function ModalController({ className, showModalOnload, name, dialog}: ModalType): ReactElement {

const ModalContainer = styled.div`
  margin: 0px;
  padding: 0px;
  width: 454px;

  // important to establish "containing block" for the modal
  position: relative;

  // they are rendered inside AppWrapper,
  // which makes it safe to override as
  // it will affect only modal rendered here
  .modal[role="dialog"],
  .modal-backdrop {
    position: fixed;
  }
  button.close {
    text-align: right;
    width: 54px;
  }
  .modal-content {
    width: 948px;
    left: -212px;
  }
  .btn-row {
   width: 65px;
  }
`;

  const [isModalOpen, setIsModalOpen] = useState(showModalOnload);

  // passed as new container to Modal
  const containerRef = useRef<HTMLDivElement>(null);

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

return(
  <ModalContainer className='text-center' ref={containerRef}>
      <Button className={`mt-3 ${className}`} onClick={showModal}>{name}</Button>
      {/* Setting backdrop="static" disables Modal close if user clicks outside of Modal */}
      <Modal
        show={isModalOpen}
        backdrop="static"
        onHide={hideModal}
        container={containerRef}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lighthouse report</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dialog}
        </Modal.Body>
        <Modal.Footer>
          <Button className='text-right btn-row' onClick={hideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </ModalContainer>
 )
}