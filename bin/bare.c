#include <assert.h>
#include <uv.h>

#include "../include/bare.h"
#include "bare.bundle.h"

int
main (int argc, char *argv[]) {
  int err;

  argv = uv_setup_args(argc, argv);

  js_platform_t *platform;
  err = js_create_platform(uv_default_loop(), NULL, &platform);
  assert(err == 0);

  bare_t *bare;
  err = bare_setup(uv_default_loop(), platform, argc, argv, NULL, &bare);
  assert(err == 0);

  uv_buf_t source = uv_buf_init((char *) bare_bin, bare_bin_len);

  err = bare_run(bare, "bare:bin.bundle", &source);
  assert(err == 0);

  int exit_code;
  err = bare_teardown(bare, &exit_code);
  assert(err == 0);

  err = js_destroy_platform(platform);
  assert(err == 0);

  return exit_code;
}
