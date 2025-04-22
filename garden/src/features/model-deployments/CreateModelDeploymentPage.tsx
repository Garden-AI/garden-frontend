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
}

/**
 * A generic container for model deployment creation pages.
 * This gives us a reusable abstraction for different types of deployments,
 * it is up to the deployment type what form is rendered.
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