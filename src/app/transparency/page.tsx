import { routes } from "@/content/routes";
import { placeholderRoute } from "@/lib/placeholder-route";

const { metadata, Page } = placeholderRoute(routes.transparency);

export { metadata };
export default Page;
