import { FileUploader, Modal, ModalSize } from '@openfun/cunningham-react';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

// Réintroduction du type FileEvent pour compatibilité
type FileEvent = { target: { value: File[] } };

type DocImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (event: FileEvent) => void;
  uploadState?: 'uploading' | 'error' | 'success';
};

const FadeModal = styled(Modal)<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  size: medium;
`;

export const DocImportModal = ({
  isOpen,
  onClose,
  onUpload,
  uploadState,
}: DocImportModalProps) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <FadeModal
      isOpen={visible}
      onClose={() => setVisible(false)}
      closeOnClickOutside
      title={t('Import files')}
      visible={visible}
      size={ModalSize.MEDIUM}
    >
      <FileUploader
        width="100%"
        text={t('Import an existing Microsoft Word file as a document')}
        multiple={false}
        onFilesChange={onUpload}
        state={uploadState}
      />
    </FadeModal>
  );
};
