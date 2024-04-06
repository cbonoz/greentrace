import BasicCard from "@/components/basic-card";
import UploadForm from "@/components/product-upload-form";

const Upload = () => {
  return (
    // container classes centered
    <div className="flex flex-col items-center justify-center mt-8">
      {/* make min width 400 */}
      <BasicCard
        className="w-[600px] p-4"
        title="Upload Product"
        description="Upload a product to the Hedera network. This item will become publically available for other users to discover."
      >
        <UploadForm />
      </BasicCard>
    </div>
  );
};

export default Upload;
