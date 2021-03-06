import bind from 'decorators/bind';
import cx from 'classnames';
import Component from 'components/component';
import React, {PropTypes} from 'react';

import styles from './property.less';
import LinkLine from './link-line';
import PropertyLink from './property-link';

export default class LinkingDataProperty extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
    links: PropTypes.array.isRequired,
    pageBuilderActions: PropTypes.object.isRequired,
    prefix: PropTypes.string.isRequired,
    linkingDataElementId: PropTypes.string.isRequired
  };

  getInitState () {
    return {
      linking: false
    };
  }

  @bind
  onMouseDown (event) {
    if (event.button === 0) {
      event.preventDefault();
      event.stopPropagation();

      this.linkingData = {
        mouseX: event.pageX,
        mouseY: event.pageY
      };

      this.setState({
        linking: true
      });
    }
  }

  @bind
  onMouseUp () {
    const {pageBuilderActions, prefix, property, linkingDataElementId} = this.props;

    pageBuilderActions.elementAddSchemaLink({
      elementId: linkingDataElementId,
      property,
      prefix
    });

    this.setState({
      linking: false
    });
  }

  render () {
    const {links, property} = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.property}>
          <span
            className={cx(styles.status, links.length && styles.linked)}
            onMouseDown={this.onMouseDown}
            ref='anchor'
          />
          <span className={styles.title}>
            {property.title || property.id}
          </span>
          <span className={styles.type}>
            {property.type}
          </span>
        </div>
        {this.renderLinks()}
        {this.renderLinking()}
      </div>
    );
  }

  renderLinks () {
    const {links} = this.props;

    if (links.length) {
      return (
        <div className={styles.links}>
          {links.map(this.renderLink, this)}
        </div>
      );
    }
  }

  renderLink (link, key) {
    const {prefix, property, pageBuilderActions, linkingDataElementId} = this.props;
    return (
      <PropertyLink
        key={link.id}
        prefix={prefix}
        linkIndex={key}
        link={link}
        property={property}
        pageBuilderActions={pageBuilderActions}
        linkingDataElementId={linkingDataElementId}
      />
    );
  }

  renderLinking () {
    const {linking} = this.state;
    if (linking) {
      return (
        <LinkLine
          anchor={this.refs.anchor}
          onMouseUp={this.onMouseUp}
          {...this.linkingData}
        />
      );
    }
  }
}
