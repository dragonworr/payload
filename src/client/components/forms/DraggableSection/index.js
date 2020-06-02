import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { Draggable } from 'react-beautiful-dnd';
import RenderFields from '../RenderFields';

import IconButton from '../../elements/IconButton';
import Pill from '../../elements/Pill';
import Chevron from '../../icons/Chevron';

import './index.scss';
import EditableBlockTitle from './EditableBlockTitle';

const baseClass = 'draggable-section';

const DraggableSection = (props) => {
  const {
    addRow,
    removeRow,
    rowIndex,
    parentName,
    fieldSchema,
    defaultValue,
    dispatchCollapsibleStates,
    collapsibleStates,
    singularLabel,
    blockType,
    fieldTypes,
  } = props;
  const draggableRef = useRef(null);

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
            {...providedDrag.draggableProps}
          >
            <div className={`${baseClass}__header`}>
              <div
                {...providedDrag.dragHandleProps}
                className={`${baseClass}__header__drag-handle`}
                onClick={() => handleCollapseClick(providedDrag)}
                role="button"
                tabIndex={0}
                ref={draggableRef}
              />

              <div className={`${baseClass}__header__row-block-type-label`}>
                {blockType === 'flexible'
                  ? <Pill>{singularLabel}</Pill>
                  : `${singularLabel} ${rowIndex + 1}`
                }
              </div>

              {blockType === 'flexible'
                && (
                  <EditableBlockTitle
                    fieldName={`${parentName}.${rowIndex}.blockName`}
                  />
                )
              }

              <div className={`${baseClass}__header__controls`}>

                <IconButton
                  iconName="Plus"
                  onClick={addRow}
                  size="small"
                />

                <IconButton
                  iconName="X"
                  onClick={removeRow}
                  size="small"
                />

                <Chevron isOpen={draggableIsOpen} />
              </div>
            </div>

            <AnimateHeight
              className={`${baseClass}__content`}
              height={draggableIsOpen ? 'auto' : 0}
              duration={0}
            >
              <RenderFields
                fieldTypes={fieldTypes}
                key={rowIndex}
                fieldSchema={fieldSchema.map((field) => {
                  const fieldName = `${parentName}.${rowIndex}${field.name ? `.${field.name}` : ''}`;
                  return ({
                    ...field,
                    name: fieldName,
                    defaultValue: field.name ? defaultValue?.[field.name] : defaultValue,
                  });
                })}
              />
            </AnimateHeight>
          </div>
        );
      }}
    </Draggable>
  );
};

DraggableSection.defaultProps = {
  rowCount: null,
  defaultValue: null,
  collapsibleStates: [],
  singularLabel: '',
  blockType: '',
};

DraggableSection.propTypes = {
  addRow: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
  parentName: PropTypes.string.isRequired,
  singularLabel: PropTypes.string,
  fieldSchema: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rowCount: PropTypes.number,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({})]),
  dispatchCollapsibleStates: PropTypes.func.isRequired,
  collapsibleStates: PropTypes.arrayOf(PropTypes.bool),
  blockType: PropTypes.string,
  fieldTypes: PropTypes.shape({}).isRequired,
};

export default DraggableSection;
