<style>
	.divider {
	    display: flex;
	}
	.divider:before, .divider:after {
		content: "";
		flex: 1;
	}
	.line {
		align-items: center;
		margin: 1em -1em;
	}
	.line:before, .line:after {
		height: 1px;
		margin: 0 1em;
	}
	.razor:before, .razor:after {
		box-shadow: 0 0.5px 0 black;
	}
	.double-razor:before, .double-razor:after {
		height: 3px;
		box-shadow: 0 -0.5px 0 black, 0 0.5px 0 black;
		border-width: 0;
	}
</style>

<div class="row">
    <div class="col mt-3 mb-3">
        <div class="text-center">
            <div class="divider line double-razor font-weight-bold">
                or
            </div>
        </div>
    </div>
</div>