import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useAuth } from '../../../utilities/Auth';
import withCondition from '../../withCondition';
import Button from '../../../elements/Button';
import reducer, { Row } from '../rowReducer';
import { useForm } from '../../Form/context';
import buildStateFromSchema from '../../Form/buildStateFromSchema';
import useField from '../../useField';
import { useLocale } from '../../../utilities/Locale';
import Error from '../../Error';
import { array } from '../../../../../fields/validations';
import Banner from '../../../elements/Banner';
import FieldDescription from '../../FieldDescription';
import { useDocumentInfo } from '../../../utilities/DocumentInfo';
import { useOperation } from '../../../utilities/OperationProvider';
import { Collapsible } from '../../../elements/Collapsible';
import RenderFields from '../../RenderFields';
import { fieldAffectsData } from '../../../../../fields/config/types';
import { Props } from './types';
import { usePreferences } from '../../../utilities/Preferences';
import { ArrayAction } from '../../../elements/ArrayAction';

import './index.scss';

const baseClass = 'array-field';

const ArrayFieldType: React.FC<Props> = (props) => {
  const {
    name,
    path: pathFromProps,
    fields,
    fieldTypes,
    validate = array,
    required,
    maxRows,
    minRows,
    permissions,
    admin: {
      readOnly,
      description,
      condition,
      className,
    },
  } = props;

  const path = pathFromProps || name;

  // Handle labeling for Arrays, Global Arrays, and Blocks
  const getLabels = (p: Props) => {
    if (p?.labels) return p.labels;
    if (p?.label) return { singular: p.label, plural: undefined };
    return { singular: 'Row', plural: 'Rows' };
  };

  const labels = getLabels(props);
  // eslint-disable-next-line react/destructuring-assignment
  const label = props?.label ?? props?.labels?.singular;

  const { preferencesKey, preferences } = useDocumentInfo();
  const { setPreference } = usePreferences();
  const [rows, dispatchRows] = useReducer(reducer, []);
  const formContext = useForm();
  const { user } = useAuth();
  const { id } = useDocumentInfo();
  const locale = useLocale();
  const operation = useOperation();

  const { dispatchFields } = formContext;

  const memoizedValidate = useCallback((value, options) => {
    return validate(value, { ...options, minRows, maxRows, required });
  }, [maxRows, minRows, required, validate]);

  const [disableFormData, setDisableFormData] = useState(false);

  const {
    showError,
    errorMessage,
    value,
    setValue,
  } = useField({
    path,
    validate: memoizedValidate,
    disableFormData,
    condition,
  });

  const addRow = useCallback(async (rowIndex: number) => {
    const subFieldState = await buildStateFromSchema({ fieldSchema: fields, operation, id, user, locale });
    dispatchFields({ type: 'ADD_ROW', rowIndex, subFieldState, path });
    dispatchRows({ type: 'ADD', rowIndex });
    setValue(value as number + 1);

    setTimeout(() => {
      const newRow = document.getElementById(`${path}-row-${rowIndex + 1}`);

      if (newRow) {
        const bounds = newRow.getBoundingClientRect();
        window.scrollBy({
          top: bounds.top - 100,
          behavior: 'smooth',
        });
      }
    }, 0);
  }, [dispatchRows, dispatchFields, fields, path, setValue, value, operation, id, user, locale]);

  const duplicateRow = useCallback(async (rowIndex: number) => {
    dispatchFields({ type: 'DUPLICATE_ROW', rowIndex, path });
    dispatchRows({ type: 'ADD', rowIndex });
    setValue(value as number + 1);
  }, [dispatchRows, dispatchFields, path, setValue, value]);

  const removeRow = useCallback((rowIndex: number) => {
    dispatchRows({ type: 'REMOVE', rowIndex });
    dispatchFields({ type: 'REMOVE_ROW', rowIndex, path });
    setValue(value as number - 1);
  }, [dispatchRows, dispatchFields, path, value, setValue]);

  const moveRow = useCallback((moveFromIndex: number, moveToIndex: number) => {
    dispatchRows({ type: 'MOVE', moveFromIndex, moveToIndex });
    dispatchFields({ type: 'MOVE_ROW', moveFromIndex, moveToIndex, path });
  }, [dispatchRows, dispatchFields, path]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    moveRow(sourceIndex, destinationIndex);
  }, [moveRow]);

  const setCollapse = useCallback(async (rowID: string, collapsed: boolean) => {
    dispatchRows({ type: 'SET_COLLAPSE', id: rowID, collapsed });

    if (preferencesKey) {
      const preferencesToSet = preferences || { fields: {} };
      let newCollapsedState = preferencesToSet?.fields?.[path]?.collapsed
        .filter((filterID) => (rows.find((row) => row.id === filterID)))
        || [];

      if (!collapsed) {
        newCollapsedState = newCollapsedState.filter((existingID) => existingID !== rowID);
      } else {
        newCollapsedState.push(rowID);
      }

      setPreference(preferencesKey, {
        ...preferencesToSet,
        fields: {
          ...preferencesToSet?.fields || {},
          [path]: {
            ...preferencesToSet?.fields?.[path],
            collapsed: newCollapsedState,
          },
        },
      });
    }
  }, [preferencesKey, preferences, path, setPreference, rows]);

  const toggleCollapseAll = useCallback(async (collapse: boolean) => {
    dispatchRows({ type: 'SET_ALL_COLLAPSED', collapse });

    if (preferencesKey) {
      const preferencesToSet = preferences || { fields: {} };

      setPreference(preferencesKey, {
        ...preferencesToSet,
        fields: {
          ...preferencesToSet?.fields || {},
          [path]: {
            ...preferencesToSet?.fields?.[path],
            collapsed: collapse ? rows.map(({ id: rowID }) => rowID) : [],
          },
        },
      });
    }
  }, [path, preferences, preferencesKey, rows, setPreference]);

  useEffect(() => {
    const data = formContext.getDataByPath<Row[]>(path);
    dispatchRows({ type: 'SET_ALL', data: data || [], collapsedState: preferences?.fields?.[path]?.collapsed });
  }, [formContext, path, preferences]);

  useEffect(() => {
    setValue(rows?.length || 0, true);

    if (rows?.length === 0) {
      setDisableFormData(false);
    } else {
      setDisableFormData(true);
    }
  }, [rows, setValue]);

  const hasMaxRows = maxRows && rows.length >= maxRows;

  const classes = [
    'field-type',
    baseClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        id={`field-${path}`}
        className={classes}
      >
        <div className={`${baseClass}__error-wrap`}>
          <Error
            showError={showError}
            message={errorMessage}
          />
        </div>
        <header className={`${baseClass}__header`}>
          <div className={`${baseClass}__header-wrap`}>
            <h3>{label}</h3>
            <ul className={`${baseClass}__header-actions`}>
              <li>
                <button
                  type="button"
                  onClick={() => toggleCollapseAll(true)}
                  className={`${baseClass}__header-action`}
                >
                  Collapse All
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => toggleCollapseAll(false)}
                  className={`${baseClass}__header-action`}
                >
                  Show All
                </button>
              </li>
            </ul>
          </div>
          <FieldDescription
            value={value}
            description={description}
          />
        </header>
        <Droppable droppableId="array-drop">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {rows.length > 0 && rows.map((row, i) => {
                const rowNumber = i + 1;

                return (
                  <Draggable
                    key={row.id}
                    draggableId={row.id}
                    index={i}
                    isDragDisabled={readOnly}
                  >
                    {(providedDrag) => (
                      <div
                        id={`${path}-row-${i}`}
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                      >
                        <Collapsible
                          collapsed={row.collapsed}
                          onToggle={(collapsed) => setCollapse(row.id, collapsed)}
                          className={`${baseClass}__row`}
                          key={row.id}
                          dragHandleProps={providedDrag.dragHandleProps}
                          header={`${labels.singular} ${rowNumber >= 10 ? rowNumber : `0${rowNumber}`}`}
                          actions={!readOnly ? (
                            <ArrayAction
                              rowCount={rows.length}
                              duplicateRow={duplicateRow}
                              addRow={addRow}
                              moveRow={moveRow}
                              removeRow={removeRow}
                              index={i}
                            />
                          ) : undefined}
                        >
                          <RenderFields
                            forceRender
                            readOnly={readOnly}
                            fieldTypes={fieldTypes}
                            permissions={permissions?.fields}
                            fieldSchema={fields.map((field) => ({
                              ...field,
                              path: `${path}.${i}${fieldAffectsData(field) ? `.${field.name}` : ''}`,
                            }))}
                          />

                        </Collapsible>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {(rows.length < minRows || (required && rows.length === 0)) && (
                <Banner type="error">
                  This field requires at least
                  {' '}
                  {minRows
                    ? `${minRows} ${labels.plural}`
                    : `1 ${labels.singular}`}
                </Banner>
              )}
              {(rows.length === 0 && readOnly) && (
                <Banner>
                  This field has no
                  {' '}
                  {labels.plural}
                  .
                </Banner>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {(!readOnly && !hasMaxRows) && (
          <div className={`${baseClass}__add-button-wrap`}>
            <Button
              onClick={() => addRow(value as number)}
              buttonStyle="icon-label"
              icon="plus"
              iconStyle="with-border"
              iconPosition="left"
            >
              {`Add ${labels.singular}`}
            </Button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default withCondition(ArrayFieldType);
