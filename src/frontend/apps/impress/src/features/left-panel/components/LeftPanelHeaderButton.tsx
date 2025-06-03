import { useTreeContext } from '@gouvfr-lasuite/ui-kit';
import { Button } from '@openfun/cunningham-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components';
import { Doc, useCreateDoc, useDocStore } from '@/features/docs';
import { useCreateChildrenDoc } from '@/features/docs/doc-tree/api/useCreateChildren';
import { isOwnerOrAdmin } from '@/features/docs/doc-tree/utils';

import { useLeftPanelStore } from '../stores';

export const LeftPanelHeaderButton = () => {
  const router = useRouter();
  const isDoc = router.pathname === '/docs/[id]';

  if (isDoc) {
    return <LeftPanelHeaderDocButton />;
  }

  return <LeftPanelHeaderHomeButton />;
};

export const LeftPanelHeaderHomeButton = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { togglePanel } = useLeftPanelStore();
  const { mutate: createDoc } = useCreateDoc({
    onSuccess: (doc) => {
      void router.push(`/docs/${doc.id}`);
      togglePanel();
    },
  });
  const handleImportClick = () => {
    const baseApiUrl = process.env.NEXT_PUBLIC_API_ORIGIN;
    const notionAuthUrl = `${baseApiUrl}/api/v1.0/notion_import/redirect`;
    window.location.href = notionAuthUrl;
  };
  return (
    <div className="flex items-center gap-2">
      <Button color="primary" onClick={() => createDoc()}>
        {t('New doc')}
      </Button>
      <Button
        onClick={handleImportClick}
        aria-label="Importer des documents depuis Notion ou Outline"
        tabIndex={0}
        size="medium"
        color="tertiary-text"
        icon={<Icon $variation="800" $theme="primary" iconName="upload" />}
      />
    </div>
  );
};

export const LeftPanelHeaderDocButton = () => {
  const router = useRouter();
  const { currentDoc } = useDocStore();
  const { t } = useTranslation();
  const { togglePanel } = useLeftPanelStore();
  const treeContext = useTreeContext<Doc>();
  const tree = treeContext?.treeData;
  const { mutate: createChildrenDoc } = useCreateChildrenDoc({
    onSuccess: (doc) => {
      tree?.addRootNode(doc);
      tree?.selectNodeById(doc.id);
      void router.push(`/docs/${doc.id}`);
      togglePanel();
    },
  });

  const onCreateDoc = () => {
    if (treeContext && treeContext.root) {
      createChildrenDoc({
        parentId: treeContext.root.id,
      });
    }
  };

  return (
    <Button
      color="tertiary"
      onClick={onCreateDoc}
      disabled={currentDoc && !isOwnerOrAdmin(currentDoc)}
    >
      {t('New page')}
    </Button>
  );
};
