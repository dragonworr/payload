import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { Draggable } from 'react-beautiful-dnd';

import RenderFields from '../RenderFields';
import Pill from '../../elements/Pill';
import Chevron from '../../icons/Chevron';
import EditableBlockTitle from './EditableBlockTitle';
import PositionHandle from './PositionHandle';
import ActionHandle from './ActionHandle';

import './index.scss';

const baseClass = 'draggable-section';

const DraggableSection = (props) => {
  const {
    moveRow,
    addRow,
    removeRow,
    rowIndex,
    parentPath,
    fieldSchema,
    initialData,
    dispatchCollapsibleStates,
    collapsibleStates,
    singularLabel,
    blockType,
    fieldTypes,
    customComponentsPath,
    positionHandleVerticalAlignment,
    actionHandleVerticalAlignment,
  } = props;

  const draggableRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleCollapseClick = () => {
    draggableRef.current.focus();
    dispatchCollapsibleStates({
      type: 'UPDATE_COLLAPSIBLE_STATUS',
      collapsibleIndex: rowIndex,
    });
  };

  const draggableIsOpen = collapsibleStates[rowIndex];
  const classes = [
    baseClass,
    draggableIsOpen && 'is-open',
    isHovered && 'is-hovered',
  ].filter(Boolean).join(' ');

  return (
    <Draggable
      draggableId={`row-${rowIndex}`}
      index={rowIndex}
    >
      {(providedDrag) => {
        return (
          <div
            ref={providedDrag.innerRef}
            className={classes}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...providedDrag.draggableProps}
          >

            {/* Render DragPoint - with MoveRow Action Points */}
            <PositionHandle
              dragHandleProps={providedDrag.dragHandleProps}
              moveRow={moveRow}
              positionIndex={rowIndex}
              verticalAlignment={positionHandleVerticalAlignment}
            />

            <div className={`${baseClass}__render-fields-wrapper`}>
              {/* Render fields */}
              <RenderFields
                initialData={initialData}
                customComponentsPath={customComponentsPath}
                fieldTypes={fieldTypes}
                key={rowIndex}
                fieldSchema={fieldSchema.map((field) => {
                  return ({
                    ...field,
                    path: `${parentPath}.${rowIndex}${field.name ? `.${field.name}` : ''}`,
                  });
                })}
              />
            </div>

            {/* Render Add/Remove/Collapse */}
            <ActionHandle
              removeRow={removeRow}
              addRow={addRow}
              rowIndex={rowIndex}
              singularLabel={singularLabel}
              verticalAlignment={actionHandleVerticalAlignment}
            />
            {/* <AnimateHeight
              className={`${baseClass}__content`}
              height={draggableIsOpen ? 'auto' : 0}
              duration={0}
            >
              <RenderFields
                initialData={initialData}
                customComponentsPath={customComponentsPath}
                fieldTypes={fieldTypes}
                key={rowIndex}
                fieldSchema={fieldSchema.map((field) => {
                  return ({
                    ...field,
                    path: `${parentPath}.${rowIndex}${field.name ? `.${field.name}` : ''}`,
                  });
                })}
              />
            </AnimateHeight> */}
          </div>
        );
      }}
    </Draggable>
  );
};

DraggableSection.defaultProps = {
  rowCount: null,
  initialData: undefined,
  collapsibleStates: [],
  singularLabel: '',
  blockType: '',
  customComponentsPath: '',
  positionHandleVerticalAlignment: 'center',
  actionHandleVerticalAlignment: 'center',
};

DraggableSection.propTypes = {
  moveRow: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
  parentPath: PropTypes.string.isRequired,
  singularLabel: PropTypes.string,
  fieldSchema: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rowCount: PropTypes.number,
  initialData: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  dispatchCollapsibleStates: PropTypes.func.isRequired,
  collapsibleStates: PropTypes.arrayOf(PropTypes.bool),
  blockType: PropTypes.string,
  fieldTypes: PropTypes.shape({}).isRequired,
  customComponentsPath: PropTypes.string,
  positionHandleVerticalAlignment: PropTypes.oneOf(['top', 'center', 'sticky']),
  actionHandleVerticalAlignment: PropTypes.oneOf(['top', 'center', 'sticky']),
};

export default DraggableSection;
