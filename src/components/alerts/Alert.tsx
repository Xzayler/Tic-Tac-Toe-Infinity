import { Portal } from 'solid-js/web';
import type { JSX } from 'solid-js';

export default function Alert(props: { children: JSX.Element }) {
  return (
    <Portal>
      <div class="absolute max-w-max top-2/3 left-0 right-0 mx-auto bg-highlight rounded-md">
        {props.children}
      </div>
    </Portal>
  );
}
