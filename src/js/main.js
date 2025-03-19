import "../styles/main.css";
import jQuery from "jquery";

jQuery(function () {
	let $buttons = jQuery(".accordion-btn"),
		$contents = jQuery(".accordion-content");

	$buttons.on("click", function () {
		let $this = jQuery(this),
			$content = $this.next(".accordion-content");

		if (!$this.hasClass("active")) {
			$buttons.removeClass("text-black active");
			$contents.slideUp();
			$this.addClass("text-black active");
			$content.slideDown();
		} else {
			$this.removeClass("text-black active");
			$content.slideUp();
		}
	});
});
