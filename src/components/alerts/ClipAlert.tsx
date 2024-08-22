import { Portal } from 'solid-js/web';

export default function ClipAlert() {
  return (
    <Portal>
      <div class="absolute max-w-max top-2/3 left-0 right-0 mx-auto bg-highlight rounded-md">
        <div class="px-2 py-1">
          <span class="text-foreground">Copied to clipboard</span>
        </div>
      </div>
    </Portal>
  );
}
