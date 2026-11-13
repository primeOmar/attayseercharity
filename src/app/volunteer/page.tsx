import { routes } from "@/content/routes";
import { placeholderRoute } from "@/lib/placeholder-route";

const { metadata, Page } = placeholderRoute(routes.volunteer);

export { metadata };
export default Page;
