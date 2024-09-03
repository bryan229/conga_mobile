import React from 'react';
import { useAppDispatch, useAppSelector } from '@store/hook';
import { closeAlertModal } from '@store/actions';
import CPAlertModal from '../alert-modal';

const GlobalAlertModal = () => {
    const dispatch = useAppDispatch();
    const isOpenAlertModal = useAppSelector((state) => state.ui.isOpenAlertModal);
    const alertModalData = useAppSelector((state) => state.ui.alertModalData);

    if (!alertModalData) return null;

    return (
        <CPAlertModal
            isVisible={isOpenAlertModal}
            toggle={() => dispatch(closeAlertModal())}
            alertData={alertModalData}
        />
    );
};

export default GlobalAlertModal;
