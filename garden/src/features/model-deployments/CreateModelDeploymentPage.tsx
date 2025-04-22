export interface CreateModelDeploymentPageProps {
    /**
     * The form element to render (e.g., ModalAppUploadPage)
     */
    form: JSX.Element,
    /**
     * Function called after successful deployment
     * @param id The ID of the deployed model
     */
    onSuccess: (id: number) => void,
    /**
     * Optional custom title for the page
     * @default "Create a Model Deployment"
     */
    title?: string,
    /**
     * Optional subtitle for the page
     */
    subtitle?: string,
}

/**
 * A generic container for model deployment creation pages
 * This component provides consistent layout and styling for different
 * types of model deployment forms (e.g., Modal Apps, HuggingFace models, etc.)
 */
export const CreateModelDeploymentPage = ({
    form,
    onSuccess,
}: CreateModelDeploymentPageProps) => {
    return (
        <div className="mx-auto max-w-6xl font-display">
            {/* Each specific form type should handle its own success callback */}
            {form}
        </div>
    );
};