import { Children, cloneElement, isValidElement } from 'react';
import { Button } from './Button.jsx';
import { cx } from './_utils.js';
import './Actions.css';

const BOXED = ['primary', 'secondary', 'brand', 'inverse'];

/**
 * One filled button per composition (AIWO blueprint 1.5, top-15 #4).
 *
 *   <Actions>
 *     <Button to="/programmes">Find your programme</Button>          ← stays filled
 *     <Button variant="secondary" to="/events">See upcoming events</Button>  ← shown as an arrow link
 *   </Actions>
 *
 * The first <Button> keeps its variant. Every later boxed <Button> (primary, secondary, brand, inverse) is shown as
 * the tertiary arrow link (text + arrow that nudges 4px on hover, underline sweep), 24px to the right of the filled
 * button (below it on phones). WhatsApp and tertiary buttons, and anything that is not a <Button>, pass through
 * untouched. Same labels, same links, same order: presentation only.
 * `as` sets the wrapper element (default div); `className` is added to it.
 */
export function Actions({ children, as: Tag = 'div', className, ...rest }) {
  let seenFilled = false;
  const out = Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== Button) return child;
    const variant = child.props.variant || 'primary';
    if (!BOXED.includes(variant)) return child;
    if (!seenFilled) {
      seenFilled = true;
      return child;
    }
    return cloneElement(child, { variant: 'tertiary', size: child.props.size === 'lg' ? 'md' : child.props.size });
  });
  return (
    <Tag className={cx('actions', className)} data-primary-cta="" {...rest}>
      {out}
    </Tag>
  );
}

export default Actions;
