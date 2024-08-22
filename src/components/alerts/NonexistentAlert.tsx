import Alert from './Alert';

export default function NonexistentAlert() {
  return (
    <Alert>
      <div class="px-2 py-1 flex flex-col items-center">
        <span class="text-foreground">That match does not exist</span>
        <span class="text-foreground">Create or try to join another</span>
      </div>
    </Alert>
  );
}
