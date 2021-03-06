import actionTypes from 'actions';
import forEach from 'lodash.foreach';
import getSchemaLinkActions from 'helpers/schema-link-actions';
import {updateDraft, saveDraft, dropDraft} from 'actions/draft';
import {updateSymbol} from 'actions/symbol';
import {mutation} from 'relate-js';

let successTimeout = null;

export function autosave () {
  return (dispatch) => {
    clearTimeout(successTimeout);
    dispatch(changeState('loading', 'Saving draft'));

    dispatch(updateDraft())
      .then(() => {
        dispatch(changeState('success', 'Autosave successful'));
        successTimeout = setTimeout(() => {dispatch(changeState(null, ''));}, 2000);
      })
      .catch(() => {
        dispatch(changeState('error', 'Error auto saving draft'));
      });
  };
}

export function save () {
  return (dispatch) => {
    clearTimeout(successTimeout);
    dispatch(changeState('loading', 'Saving page'));

    dispatch(saveDraft())
      .then(() => {
        dispatch(changeState('success', 'Page saved successfuly'));
        successTimeout = setTimeout(() => {dispatch(changeState(null, ''));}, 2000);
      })
      .catch(() => {
        dispatch(changeState('error', 'Error saving page'));
      });
  };
}

export function drop () {
  return (dispatch) => {
    clearTimeout(successTimeout);
    dispatch(changeState('loading', 'Dropping draft'));

    dispatch(dropDraft())
      .then(() => {
        dispatch(changeState('success', 'Draft dropped successfuly'));
        successTimeout = setTimeout(() => {dispatch(changeState(null, ''));}, 2000);
      })
      .catch(() => {
        dispatch(changeState('error', 'Error dropping draft'));
      });
  };
}

export function changeState (state, message) {
  return {
    type: actionTypes.pbChangeState,
    state,
    message
  };
}

export function toggleEditing () {
  return {
    type: actionTypes.pbToggleEditing
  };
}

export function setMenuOpened (value) {
  return {
    type: actionTypes.pbSetMenuOpened,
    value
  };
}

export function setMenuSide (value) {
  return {
    type: actionTypes.pbSetMenuSide,
    value
  };
}

export function setMenuTab (value) {
  return {
    type: actionTypes.pbSetMenuTab,
    value
  };
}

export function openElementsMenu (options) {
  return {
    type: actionTypes.pbOpenElementsMenu,
    options
  };
}

export function closeElementsMenu () {
  return {
    type: actionTypes.pbCloseElementsMenu
  };
}

export function toggleCategory (category) {
  return {
    type: actionTypes.pbToggleCategory,
    category
  };
}

export function toggleExpandElement (elementId, context) {
  return {
    type: actionTypes.pbToggleExpandElement,
    elementId,
    context
  };
}

export function collapseAll () {
  return {
    type: actionTypes.pbCollapseAll
  };
}

export function expandAll () {
  return {
    type: actionTypes.pbExpandAll
  };
}

export function overElement (elementId, context) {
  return {
    type: actionTypes.pbOverElement,
    elementId,
    context
  };
}

export function outElement (elementId, context) {
  return {
    type: actionTypes.pbOutElement,
    elementId,
    context
  };
}

export function selectElement (elementId, context) {
  return {
    type: actionTypes.pbSelectElement,
    elementId,
    context
  };
}

export function duplicateElement (elementId, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'duplicate',
      elementId,
      context
    }
  };
}

export function removeElement (elementId, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'remove',
      elementId,
      context
    }
  };
}

export function toggleElementVisibleOn (elementId, display, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'changeDisplay',
      elementId,
      display,
      context
    }
  };
}

export function changeElementAnimation (elementId, property, value, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'changeAnimation',
      elementId,
      property,
      value,
      context
    }
  };
}

export function changeElementPosition (elementId, property, value, context) {
  return (dispatch, getState) => {
    const {display} = getState();
    dispatch({
      type: actionTypes.pbDoAction,
      action: {
        type: 'changePosition',
        elementId,
        property,
        value,
        display,
        context
      }
    });
  };
}

export function changeElementLabel (elementId, value, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'changeLabel',
      elementId,
      value,
      context
    }
  };
}

export function changeElementStyle (elementId, property, value, context) {
  return (dispatch, getState) => {
    const {display} = getState();
    dispatch({
      type: actionTypes.pbDoAction,
      action: {
        type: 'changeStyle',
        elementId,
        property,
        value,
        display,
        context
      }
    });
  };
}

export function changeElementProperty (elementId, property, value, context) {
  return (dispatch, getState) => {
    const {display} = getState();
    dispatch({
      type: actionTypes.pbDoAction,
      action: {
        type: 'changeProp',
        elementId,
        property,
        value,
        display,
        context
      }
    });
  };
}

export function changeElementContent (elementId, value, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'changeContent',
      elementId,
      value,
      context
    }
  };
}

export function changeElementChildren (elementId, children, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'changeChildren',
      elementId,
      children,
      context
    }
  };
}

export function elementAddSchemaLink ({elementId, property, prefix, context}) {
  return (dispatch, getState) => {
    const state = getState();
    const {overed, doc} = state.pageBuilder;
    const overedElement = overed && doc[overed.context][overed.id];

    if (overedElement) {
      const actions = getSchemaLinkActions(
        state.pageBuilder,
        overedElement,
        property
      );

      dispatch({
        type: actionTypes.pbDoAction,
        action: {
          type: 'elementAddSchemaLink',
          elementId,
          context,
          propertyId: prefix + property.id,
          linkElementId: overed.id,
          action: actions.values[0]
        }
      });
    }
  };
}

export function elementRemoveSchemaLink (elementId, propertyId, index, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'elementRemoveSchemaLink',
      elementId,
      propertyId,
      index,
      context
    }
  };
}

export function elementChangeSchemaLinkAction (elementId, propertyId, index, value, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'elementChangeSchemaLinkAction',
      elementId,
      propertyId,
      index,
      value,
      context
    }
  };
}

export function undoAction () {
  return {
    type: actionTypes.pbUndoAction
  };
}

export function redoAction () {
  return {
    type: actionTypes.pbRedoAction
  };
}

export function addElementAt (element, destination) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'new',
      element,
      destination // destination contains context
    }
  };
}

export function makeElementDynamic (elementId, context) {
  return {
    type: actionTypes.pbDoAction,
    action: {
      type: 'makeDynamic',
      elementId,
      context
    }
  };
}

export function draggedComponent (dragInfo, dropInfo) {
  const action = {
    type: dragInfo.type
  };

  if (dragInfo.type === 'new') {
    action.element = {
      tag: dragInfo.element,
      context: dragInfo.context
    };
  } else if (dragInfo.type === 'move') {
    action.source = {
      id: dragInfo.id,
      context: dragInfo.context
    };
  }

  action.destination = {
    id: dropInfo.id,
    position: 0,
    context: dropInfo.context
  };

  if (typeof dropInfo.position !== 'undefined') {
    action.destination.position = dropInfo.position;
  }

  return {
    type: actionTypes.pbDoAction,
    action
  };
}

export function linkDataMode (elementId, context) {
  return {
    type: actionTypes.pbLinkDataMode,
    elementId,
    context
  };
}

export function closeLinkDataMode () {
  return {
    type: actionTypes.pbCloseLinkDataMode
  };
}

function extractChildren (children, data, draftData, parentId) {
  forEach(children, (childId) => {
    data[childId] = Object.assign({}, draftData[childId]);
    if (parentId) {
      data[childId].parent = parentId;
    }
    if (data[childId].children && data[childId].children.constructor === Array) {
      extractChildren(data[childId].children, data, draftData);
    }
  });
}

export function makeElementSymbol (elementId, title, context) {
  return (dispatch, getState) => {
    const symbolData = {};
    const draftDoc = getState().pageBuilder.doc;
    const draftData = draftDoc[context];

    symbolData.base = Object.assign({}, draftData[elementId]);
    symbolData.base.id = 'base';
    delete symbolData.base.parent;
    if (symbolData.base.children && symbolData.base.children.constructor === Array) {
      extractChildren(symbolData.base.children, symbolData, draftData, 'base');
    }

    const data = {
      title,
      data: symbolData
    };

    mutation({
      fragments: {
        addSymbol: {
          _id: 1,
          title: 1,
          data: 1
        }
      },
      variables: {
        addSymbol: {
          data: {
            type: 'SymbolInput!',
            value: data
          }
        }
      }
    }, (result) => {
      if (result.addSymbol) {
        dispatch({
          type: actionTypes.makeElementSymbol,
          symbol: result.addSymbol,
          elementId,
          context
        });
      }
    })(dispatch, getState);
  };
}

export function editSymbol (elementId, symbol, context) {
  return {
    type: actionTypes.pbEditSymbol,
    elementId,
    symbol,
    context
  };
}

export function closeEditSymbol () {
  return {
    type: actionTypes.pbCloseEditSymbol
  };
}

export function saveSymbol (symbolId) {
  return (dispatch, getState) => {
    const data = getState().pageBuilder.symbolsData[symbolId].doc[symbolId];

    updateSymbol(symbolId, data, () => {
      dispatch({
        type: actionTypes.pbCloseEditSymbol
      });
    })(dispatch, getState);
  };
}

export function changeLinkTabSchemaId (schemaId) {
  return {
    type: actionTypes.pbChangeLinkTabSchemaId,
    schemaId
  };
}
