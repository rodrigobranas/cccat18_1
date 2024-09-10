<script setup lang="ts">
	import { ref } from "vue";
	const form = ref({}) as any;
	const status = ref("");

	async function send () {
		const response = await fetch("http://localhost:3000/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(form.value)
		});
		const output = await response.json();
		if (output.accountId) {
			status.value = "success";
		}
		if (output.message) {
			status.value = output.message;
		}
	};
</script>

<template>
	<input class="input-name" type="text" v-model="form.name"/>
	<input class="input-email" type="text" v-model="form.email"/>
	<input class="input-cpf" type="text" v-model="form.cpf"/>
	<input class="input-password" type="text" v-model="form.password"/>
	<input class="input-is-passenger" type="checkbox" v-model="form.isPassenger"/>
	<button class="button-confirm" @click="send()">Confirm</button>
	<span class="span-status">{{  status }}</span>
</template>

<style scoped>
</style>
