import { ProgressSpinner } from 'primereact/progressspinner';

export interface LoadingProps {
  height?: string;
  spinnerSize?: string;
  icon?: string;
}

export const Loading = ({
  height = '90vh',
  icon,
  spinnerSize,
}: LoadingProps) => {
  return (
    <div className="relative">
      <div
        className="flex justify-content-center align-items-center"
        style={{ height }}
      >
        <ProgressSpinner
          style={spinnerSize ? { width: spinnerSize, height: spinnerSize } : {}}
        />
      </div>
      {icon && (
        <div
          className="absolute top-50 left-50"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <i className={icon} />
        </div>
      )}
    </div>
  );
};
