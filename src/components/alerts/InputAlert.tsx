import Alert from './Alert';

export default function InputAlert() {
  return (
    <Alert>
      <div class="px-2 py-1">
        <span class="text-foreground">Please only input numbers</span>
      </div>
    </Alert>
  );
}
