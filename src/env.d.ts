declare module "*.vue" {
	import type { DefineComponent } from "vue";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-utils
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
