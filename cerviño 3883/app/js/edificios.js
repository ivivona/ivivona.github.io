q = function() {
  var slice = Array.prototype.slice;
  var args = slice.call(arguments);
  var matches = slice.call(document.querySelectorAll.apply(document, args));
  Object.defineProperty(matches, 'selector', { value: (args.length > 1 ? args : args[0]) });
  return matches;
};

Element.prototype.is = Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector ||
                          Element.prototype.oMatchesSelector || Element.prototype.matchesSelector;

Array.prototype.each = function(callback) {
  this.forEach(function(e) { callback.call(e); });
};

Array.prototype.on = function(event, callback) {
  var selector = this.selector;
  if(selector) {
    document.addEventListener(event, function(e) {
      if(e.target.is(selector)) callback.call(e.target, e);
    });
  }
  return this;
};

Element.prototype.trigger = function(eventName, eventProperties) {
  var event = document.createEvent('Events');
  for(var prop in eventProperties) {
    event[prop] = eventProperties[prop];
  }
  event.initEvent(eventName, true, true);
  this.dispatchEvent(event);
};

Element.prototype.toggleClass = function(className) {
  this.classList.toggle(className);
};

Element.prototype.siblings = function() {
  var siblings = [];
  if(this.parentElement) {
    var element = this.parentElement.firstElementChild;
    while(element) {
      if(element != this) {
        siblings.push(element);
      }
      element = element.nextElementSibling;
    }
  }
  return siblings;
};

q('.toggle-between *').on('touchend', function() {
  this.toggleClass('active');
  this.siblings().each(function() {
    this.toggleClass('active');
  });
  this.parentElement.trigger('toggle', { active: this.parentElement.querySelector('.active') });
});