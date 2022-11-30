import React, { createContext, useContext } from 'react';
import { Modal, useModal } from '@faceless-ui/modal';
import { useWindowInfo } from '@faceless-ui/window-info';
import { Props, TogglerProps } from './types';
import './index.scss';

const baseClass = 'drawer';

export const DrawerDepthContext = createContext(0);

export const useDrawerDepth = (): number => useContext(DrawerDepthContext);

const zBase = 100;

const formatDrawerSlug = ({
  slug,
  depth,
}: {
  slug: string,
  depth: number,
}) => `drawer-lvl${depth}-${slug}`;

export const DrawerToggler: React.FC<TogglerProps> = ({
  slug,
  children,
}) => {
  const { openModal } = useModal();
  const drawerDepth = useDrawerDepth();

  return (
    <button
      onClick={() => openModal(formatDrawerSlug({ slug, depth: drawerDepth }))}
      type="button"
    >
      {children}
    </button>
  );
};

export const Drawer: React.FC<Props> = ({
  slug,
  children,
}) => {
  const { toggleModal, isModalOpen } = useModal();
  const { breakpoints: { m: midBreak } } = useWindowInfo();
  const drawerDepth = useDrawerDepth();

  const modalSlug = formatDrawerSlug({ slug, depth: drawerDepth });
  const isOpen = isModalOpen(modalSlug);

  return (
    <Modal
      slug={modalSlug}
      className={[
        baseClass,
        isOpen && `${baseClass}--is-open`,
      ].filter(Boolean).join(' ')}
      style={{
        zIndex: zBase + drawerDepth,
      }}
    >
      {drawerDepth === 0 && (
        <div className={`${baseClass}__blur-bg`} />
      )}
      <button
        className={`${baseClass}__close`}
        type="button"
        onClick={() => toggleModal(modalSlug)}
        style={{
          width: `calc(${midBreak ? 'var(--gutter-h)' : 'var(--nav-width)'} + ${drawerDepth - 1} * 25px)`,
        }}
      >
        <span>
          Close
        </span>
      </button>
      <div className={`${baseClass}__content`}>
        <div className={`${baseClass}__content-children`}>
          <DrawerDepthContext.Provider value={drawerDepth + 1}>
            {children}
          </DrawerDepthContext.Provider>
        </div>
      </div>
    </Modal>
  );
};

export type IDrawerContext = {
  Drawer: React.FC<Props>,
  DrawerToggler: React.FC<TogglerProps>
}

export const DrawerContext = createContext({
  Drawer,
  DrawerToggler,
});

export const useDrawer = (): IDrawerContext => useContext(DrawerContext);
