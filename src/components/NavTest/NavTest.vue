<template>
	<!-- With Submenu -->
	<NavigationMenuRoot
		:disable-pointer-leave-close="true"
		:disable-hover-trigger="true"
		:v-model="selectedItem"
	>
		<NavigationMenuList>
			<NavigationMenuItem value="item1">
				<NavigationMenuTrigger>Item one</NavigationMenuTrigger>
				<NavigationMenuContent>Item one content</NavigationMenuContent>
			</NavigationMenuItem>
			<NavigationMenuItem value="item2">
				<NavigationMenuTrigger>Item two</NavigationMenuTrigger>
				<NavigationMenuContent>
					<NavigationMenuSub>
						<NavigationMenuList>
							<NavigationMenuItem value="sub1">
								<NavigationMenuTrigger>Sub item one</NavigationMenuTrigger>
								<NavigationMenuContent>
									Sub item one content
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem value="sub2">
								<NavigationMenuTrigger>Sub item two</NavigationMenuTrigger>
								<NavigationMenuContent>
									Sub item two content
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenuSub>
				</NavigationMenuContent>
			</NavigationMenuItem>
		</NavigationMenuList>
	</NavigationMenuRoot>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuRoot,
	NavigationMenuTrigger,
	NavigationMenuSub,
} from 'reka-ui';

const selectedItem = ref('item2');

watch(selectedItem, (newSelectedItem) => {
	console.log('new selected item:', newSelectedItem);
});
</script>
