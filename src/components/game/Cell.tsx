import { Show, Switch, Match } from 'solid-js';
import CircleIcon from '../icons/CircleIcon';
import CrossIcon from '../icons/CrossIcon';

export default function Cell(props: { value: null | 'x' | 'o' }) {
  return (
    <div class="h-full w-full p-2 hover:bg-highlightextra bg-highlight">
      <Switch>
        <Match when={props.value === null}>
          <div class="w-full h-full"></div>
        </Match>
        <Match when={props.value === 'o'}>
          <CircleIcon />
        </Match>
        <Match when={props.value === 'x'}>
          <CrossIcon />
        </Match>
      </Switch>
    </div>
  );
}
