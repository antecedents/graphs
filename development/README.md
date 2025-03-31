
<br>

### Notes

Launch an interactive environment via

```shell
docker run --rm -i -t -p 8080:80 -w /app 
  --mount type=bind,src="$(pwd)",target=/app 
    dynamic
```

Subsequently, launch a web server via

```shell
nginx -g 'daemon off;'
```

The URL is 

```yaml
http://localhost:8080
```

Note, for an immediate web server launch $\rightarrow$

```shell
docker run --rm -i -t -p 8080:80 -w /app 
  --mount type=bind,src="$(pwd)",target=/app 
    dynamic nginx -g 'daemon off;'
```


<br>
<br>


### References

JavaScript Modules
* [Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
* [Modules](https://javascript.info/modules)
* [Module Errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/import_decl_module_top_level#importing_in_a_non-module_script)
* [SCRIPT](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)

JavaScript
* [fetch](https://javascript.info/fetch)
* [1](https://wpdean.com/css-dropdown-menus/), [2](https://jsfiddle.net/cL2x7/), [3](www.geeksforgeeks.org/how-to-creating-html-list-from-javascript-array/)

live server
* [live server](https://itnext.io/dockerizing-modern-web-apps-cd9667eebf44)
* [github](https://github.com/tapio/live-server)
* [npm](https://www.npmjs.com/package/live-server)

NGINX
* [docker hub](https://hub.docker.com/_/nginx)
* [docker nginx](https://toxigon.com/setting-up-nginx-with-docker)
* [docker nginx](https://www.uptimia.com/questions/how-to-run-nginx-in-the-foreground-within-a-docker-container#implementing-the-solution-in-docker)
* [extra help](https://itnext.io/dockerizing-modern-web-apps-cd9667eebf44)
* [more](https://www.socketxp.com/iot/remote-access-nginx-web-server-from-internet/)
* [nginx -g 'daemon off;'](https://www.thecoderscamp.com/nginx-g-daemon-off/)
* [Dockerfile](https://github.com/devasthali-os/nginx-base/blob/master/Dockerfile)
* [conf](https://nginx.org/en/docs/beginners_guide.html#conf_structure)
* [MIME (Multipurpose Internet Mail Extensions) Types](https://server.hk/blog/14461/)
* [MIME Types](https://www.slingacademy.com/article/nginx-mime-types-the-complete-guide/)
* [load error example](https://www.slingacademy.com/article/nginx-error-cannot-load-css-js-files/)

Docker
* [docker run](https://docs.docker.com/reference/cli/docker/container/run/)

vim & vi
* [vi](https://linuxsimply.com/cheat-sheets/vi/)
* [vim](https://vim.rtorr.com)
* [vim](https://www.redhat.com/en/blog/beginners-guide-vim)


<br>
<br>

<br>
<br>

<br>
<br>

<br>
<br>