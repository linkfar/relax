import chai from 'chai';

import action from '../element-add-schema-link';

const expect = chai.expect;

describe('PB: add schema link to element', () => {
  it('should be a function', () => {
    expect(action).to.be.a('function');
  });

  it('error if not a valid action', () => {
    expect(action).to.throw(Error);
    expect(action.bind(null, {}, {
      destination: {
        invalid: 1
      }
    })).to.throw(Error);
  });

  it('adds schema link to element', () => {
    const iniDoc = {
      data: {
        0: {
          id: '0'
        }
      }
    };
    const expectedDoc = {
      data: {
        0: {
          id: '0',
          props: {
            schemaLinks: {
              property: [
                {
                  elementId: 'someElem',
                  action: 'content'
                }
              ]
            }
          }
        }
      }
    };
    const expectedRevert = {
      type: 'elementRemoveSchemaLink',
      elementId: '0',
      propertyId: 'property',
      index: 0,
      context: 'data'
    };

    const result = action(iniDoc, {
      type: 'elementAddSchemaLink',
      elementId: '0',
      linkElementId: 'someElem',
      propertyId: 'property',
      action: 'content',
      context: 'data'
    });

    expect(result).to.be.an('object');
    expect(result).to.have.property('doc');
    expect(result).to.have.property('revertAction');
    expect(result.doc).to.not.equal(iniDoc);
    expect(result.doc).to.deep.equals(expectedDoc);
    expect(result.revertAction).to.deep.equals(expectedRevert);
  });
});
