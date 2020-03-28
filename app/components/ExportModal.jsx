import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

export default function ExportModal(props) {
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Export confirmation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure to export your note?
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-secondary' onClick={props.onHide}>Close</Button>
                <Button onClick={props.onExport}>Export</Button>
            </Modal.Footer>
        </Modal>
    );
}