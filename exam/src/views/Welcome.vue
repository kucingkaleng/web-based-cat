<template>
  <div class="background-gradient">
    <div class="container">
      <div class="columns is-centered is-vcentered" style="height:100vh;">
        <div class="column is-4-desktop is-5-tablet">
          <div class="box">
            <p class="title is-size-4 has-text-centered">Login</p>
  
            <section>
              <b-field label="Username"
                :type="{ 'is-danger': hasError }"
                :message="{ 'Username is not available': hasError }">
                <b-input v-model="username" maxlength="30"></b-input>
              </b-field>
  
              <b-field label="Password"
                :type="{ 'is-danger': hasError }"
                :message="[
                  { 'Password is too short': hasError },
                  { 'Password must have at least 8 characters': hasError }
                ]">
                <b-input v-model="password" type="password" maxlength="30"></b-input>
              </b-field>

              <b-field>
                <p class="control">
                  <button class="button is-primary" style="width:100%;" @click="signin">
                    Login
                  </button>
                </p>
              </b-field>
            </section>
  
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      hasError: false
    }
  },

  methods: {
    signin: function () {
      let username = this.username 
      let password = this.password
      this.$store.dispatch('login', { username, password })
      .then(() => {
        if (this.$store.state.user.role == 'admin') {
          this.$router.push('/dashboard')
        }
        else {
          this.$router.push('/home')
        }
      })
      .catch(err => console.log(err))
    }
  },
}
</script>

<style lang="scss" scoped>
.background-gradient {
  width:100%;
  height:100vh;
  background-color: #fff;
  // background-color: #08AEEA;
  // background-image: linear-gradient(0deg, #08AEEA 0%, #2AF598 100%);
}
</style>
